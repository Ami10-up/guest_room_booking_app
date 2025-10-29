// lib/models/app_models.dart

// This file contains all the data models used throughout the Flutter application.

// -----------------
// --- ENUMS ---
// -----------------
// Enums provide type-safe, predefined sets of values.

enum Rank { OR, JCO, Officer }
enum BookingStatus { pending, approved, rejected, cancelled }
enum ReasonForVisit { leave, tD, other }

// -----------------
// --- EXTENSIONS ---
// -----------------
// Extensions add functionality to existing classes. Here, we add a user-friendly
// 'displayName' property to our enums for use in the UI.

extension BookingStatusExtension on BookingStatus {
  String get displayName {
    switch (this) {
      case BookingStatus.pending: return 'Pending';
      case BookingStatus.approved: return 'Approved';
      case BookingStatus.rejected: return 'Rejected';
      case BookingStatus.cancelled: return 'Cancelled';
    }
  }
}

extension ReasonForVisitExtension on ReasonForVisit {
  String get displayName {
    switch (this) {
      case ReasonForVisit.leave: return 'Leave';
      case ReasonForVisit.tD: return 'TD';
      case ReasonForVisit.other: return 'Other';
    }
  }
}


// -----------------
// --- DATA CLASSES ---
// -----------------

// Represents a guest house category fetched from the API.
class GuestRoomCategory {
  final int id;
  final String name;
  final String allowedRank;

  GuestRoomCategory({
    required this.id,
    required this.name,
    required this.allowedRank,
  });

  // A 'factory constructor' that creates a GuestRoomCategory instance
  // from a JSON map, which is what our API returns.
  factory GuestRoomCategory.fromJson(Map<String, dynamic> json) {
    return GuestRoomCategory(
      id: json['id'],
      name: json['name'],
      allowedRank: json['allowedRank'],
    );
  }
}

// Represents a single booking record fetched from the API.
class Booking {
  final int id;
  final int userId;
  final String status;
  
  // This flexible map holds all the details submitted in the booking form.
  // This prevents us from having to define every single field in the class.
  final Map<String, dynamic> formData;

  Booking({
    required this.id,
    required this.userId,
    required this.status,
    required this.formData,
  });
  
  // A factory constructor that creates a Booking instance from a JSON map.
  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'],
      userId: json['userId'],
      status: json['status'],
      // We store the entire JSON object in formData for easy access
      // to all booking details in the UI (e.g., booking.formData['name']).
      formData: json, 
    );
  }
}