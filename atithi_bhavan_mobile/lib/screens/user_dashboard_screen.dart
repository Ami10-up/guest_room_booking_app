// lib/screens/user_dashboard_screen.dart

import 'package:atithi_bhavan_mobile/models/app_models.dart';
import 'package:atithi_bhavan_mobile/screens/booking_form_screen.dart';
import 'package:atithi_bhavan_mobile/screens/login_screen.dart';
import 'package:atithi_bhavan_mobile/services/api_service.dart';
import 'package:atithi_bhavan_mobile/widgets/booking_status_card.dart';
import 'package:flutter/material.dart';

class UserHomeScreen extends StatefulWidget {
  final Map<String, dynamic> userData;
  final String token;
  const UserHomeScreen({super.key, required this.userData, required this.token});

  @override
  State<UserHomeScreen> createState() => _UserHomeScreenState();
}

class _UserHomeScreenState extends State<UserHomeScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<Booking>> _userBookingsFuture;

  @override
  void initState() {
    super.initState();
    _loadBookings();
  }

  void _loadBookings() {
    setState(() {
      _userBookingsFuture = _apiService.getBookingsForUser(
        widget.userData['id'].toString(),
        widget.token,
      );
    });
  }

  Future<void> _cancelBooking(int bookingId) async {
    final result = await _apiService.cancelBooking(bookingId, widget.token);

    if (!mounted) return;

    if (result != null) {
      // Display the specific message from the server (e.g., "Request sent")
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message']), backgroundColor: Colors.green),
      );
      _loadBookings(); // Refresh the list
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Operation failed. Please try again."), backgroundColor: Colors.red),
      );
    }
  }

  // --- THIS IS THE COMPLETE _navigateToBookingForm METHOD ---
  void _navigateToBookingForm() async {
    final result = await Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => BookingFormScreen(
          token: widget.token,
          userId: widget.userData['id'],
        ),
      ),
    );
    if (result == true) {
      _loadBookings(); // Refresh the list if a new booking was made
    }
  }

  // --- THIS IS THE COMPLETE _logout METHOD ---
  void _logout() {
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const LoginScreen()),
      (Route<dynamic> route) => false,
    );
  }

  // --- THIS IS THE COMPLETE build METHOD ---
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: Text("Welcome, ${widget.userData['fullName']}"),
          actions: [
            IconButton(
              icon: const Icon(Icons.logout),
              tooltip: "Logout",
              onPressed: _logout,
            ),
          ],
          bottom: const TabBar(
            tabs: [
              Tab(icon: Icon(Icons.history), text: "Booking Status"),
              Tab(icon: Icon(Icons.add_circle_outline), text: "New Booking"),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildBookingStatusTab(),
            _buildNewBookingTab(),
          ],
        ),
      ),
    );
  }

  // In lib/screens/user_dashboard_screen.dart

  // In lib/screens/user_dashboard_screen.dart

  Widget _buildBookingStatusTab() {
    return FutureBuilder<List<Booking>>(
      future: _userBookingsFuture,
      builder: (context, snapshot) {
        // Handle loading state
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } 
        // Handle error state
        else if (snapshot.hasError) {
          return Center(child: Text("Error fetching bookings: ${snapshot.error}"));
        } 
        
        // If data is available (even if it's an empty list)
        final bookings = snapshot.data ?? [];

        return Column(
          children: [
            Expanded(
              child: bookings.isEmpty
                  // Show a message if there are no bookings
                  ? const Center(
                      child: Text(
                        "You have not made any bookings yet.",
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 16, color: Colors.grey),
                      ),
                    )
                  // Show the list of bookings if it's not empty
                  : RefreshIndicator(
                      onRefresh: () async => _loadBookings(),
                      child: ListView.builder(
                        padding: const EdgeInsets.all(8.0),
                        itemCount: bookings.length,
                        itemBuilder: (context, index) {
                          final booking = bookings[index];
                          return BookingStatusCard(
                            key: ValueKey(booking.id), // Add a key for better performance
                            booking: booking,
                            // --- THIS IS THE CRITICAL FIX ---
                            // Pass the token down to the card widget
                            token: widget.token, 
                            onCancel: () => _cancelBooking(booking.id),
                          );
                        },
                      ),
                    ),
            ),
            // The "Contact Us" footer section
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Text(
                    "For any queries regarding your booking, please contact:",
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey.shade700),
                  ),
                  const SizedBox(height: 8),
                  const SelectableText(
                    "abhyagatcustomercare@gmail.com",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
  
  // --- THIS IS THE COMPLETE _buildNewBookingTab METHOD ---
  Widget _buildNewBookingTab() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: ElevatedButton.icon(
          icon: const Icon(Icons.add),
          label: const Text("Create a New Booking Request"),
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
            textStyle: const TextStyle(fontSize: 16),
          ),
          onPressed: _navigateToBookingForm,
        ),
      ),
    );
  }
}