// lib/services/api_service.dart

import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io'; // Required for SocketException
import 'package:atithi_bhavan_mobile/models/app_models.dart';

class ApiService {
  // IMPORTANT: Base URL can be overridden at runtime using --dart-define=BASE_URL=<url>
  // Default kept as a fallback for local development.
  static const String _defaultBaseUrl = 'https://306ee0978f6e.ngrok-free.app';
  final String _baseUrl = const String.fromEnvironment('BASE_URL', defaultValue: _defaultBaseUrl);

  // Shared headers for all API calls.
  final Map<String, String> _headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };

  // --- AUTHENTICATION METHODS ---

  Future<Map<String, dynamic>> registerUser({
    required Map<String, String> userData,
  }) async {
    final uri = Uri.parse('$_baseUrl/api/auth/register');
    try {
      final response = await http.post(uri, headers: _headers, body: json.encode(userData));
      // Try to decode JSON response; if server returned HTML or plain text, fall back to raw text
      dynamic responseBody;
      if (response.body.isNotEmpty) {
        try {
          responseBody = json.decode(response.body);
        } catch (e) {
          // Not JSON (probably an HTML error page or plain text). Return the raw body as message.
          responseBody = {'message': response.body};
        }
      } else {
        responseBody = {};
      }
      return {'statusCode': response.statusCode, 'body': responseBody};
    } on SocketException catch (e) {
      return {'statusCode': 503, 'body': {'message': 'Network Error: Could not reach server. $e'}};
    } catch (e) {
      return {'statusCode': 500, 'body': {'message': 'An unexpected error occurred: $e'}};
    }
  }

  Future<Map<String, dynamic>?> loginUser(String username, String password) async {
    final uri = Uri.parse('$_baseUrl/api/auth/login');
    try {
      final response = await http.post(uri, headers: _headers, body: json.encode({'username': username, 'password': password}));
      if (response.statusCode == 200 && response.body.isNotEmpty) {
        try {
          return json.decode(response.body);
        } catch (_) {
          // Non-JSON body -> wrap and return
          return {'message': response.body};
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<String?> getSecurityQuestion(String username) async {
    final uri = Uri.parse('$_baseUrl/api/auth/security-question?username=$username');
    try {
      final response = await http.get(uri, headers: _headers);
      if (response.statusCode == 200 && response.body.isNotEmpty) {
        return json.decode(response.body)['securityQuestion'];
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<bool> resetPassword({
    required String username,
    required String securityAnswer,
    required String newPassword,
  }) async {
    final uri = Uri.parse('$_baseUrl/api/auth/reset-password');
    try {
      final response = await http.post(
        uri,
        headers: _headers,
        body: json.encode({
          'username': username,
          'securityAnswer': securityAnswer,
          'newPassword': newPassword,
        }),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  // --- BOOKING & ROOM METHODS ---

  Future<List<Booking>> getBookingsForUser(String userId, String token) async {
    final uri = Uri.parse('$_baseUrl/api/bookings');
    try {
      final authHeaders = {..._headers, 'Authorization': 'Bearer $token'};
      final response = await http.get(uri, headers: authHeaders);
      if (response.statusCode == 200 && response.body.isNotEmpty) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Booking.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<Booking?> submitBooking(Map<String, dynamic> bookingData, String token) async {
    final uri = Uri.parse('$_baseUrl/api/bookings');
    try {
      final authHeaders = {..._headers, 'Authorization': 'Bearer $token'};
      final response = await http.post(
        uri,
        headers: authHeaders,
        body: json.encode(bookingData),
      );
      if (response.statusCode == 201 && response.body.isNotEmpty) {
        return Booking.fromJson(json.decode(response.body));
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<Map<String, dynamic>?> cancelBooking(int bookingId, String token) async {
    final uri = Uri.parse('$_baseUrl/api/bookings/$bookingId/cancel');
    try {
      final authHeaders = {..._headers, 'Authorization': 'Bearer $token'};
      final response = await http.put(uri, headers: authHeaders);
      if (response.statusCode == 200 && response.body.isNotEmpty) {
        return json.decode(response.body);
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  
  Future<int?> checkVacancy({
    required int categoryId,
    required DateTime fromDate,
    required DateTime toDate,
    required String token,
  }) async {
    final fromDateString = fromDate.toIso8601String().split('T')[0];
    final toDateString = toDate.toIso8601String().split('T')[0];
    final uri = Uri.parse('$_baseUrl/api/bookings/vacancy?categoryId=$categoryId&dateFrom=$fromDateString&dateTo=$toDateString');
    try {
      final authHeaders = {..._headers, 'Authorization': 'Bearer $token'};
      final response = await http.get(uri, headers: authHeaders);
      if (response.statusCode == 200 && response.body.isNotEmpty) {
        return json.decode(response.body)['availableRooms'];
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<List<GuestRoomCategory>> getGuestRoomCategories(String token) async {
    final uri = Uri.parse('$_baseUrl/api/categories');
    try {
      final authHeaders = {..._headers, 'Authorization': 'Bearer $token'};
      final response = await http.get(uri, headers: authHeaders);
      if (response.statusCode == 200 && response.body.isNotEmpty) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => GuestRoomCategory.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }
  
  Future<Map<String, dynamic>?> getManagerDetails(int categoryId, String token) async {
    final uri = Uri.parse('$_baseUrl/api/rooms/manager/$categoryId');
    try {
      final authHeaders = {..._headers, 'Authorization': 'Bearer $token'};
      final response = await http.get(uri, headers: authHeaders);
      if (response.statusCode == 200 && response.body.isNotEmpty) {
        return json.decode(response.body);
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}