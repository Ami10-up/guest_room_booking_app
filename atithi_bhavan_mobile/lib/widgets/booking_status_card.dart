// lib/widgets/booking_status_card.dart

import 'package:atithi_bhavan_mobile/models/app_models.dart';
import 'package:atithi_bhavan_mobile/services/api_service.dart';
import 'package:flutter/material.dart';

class BookingStatusCard extends StatefulWidget {
  final Booking booking;
  final VoidCallback? onCancel;
  final VoidCallback? onEdit;
  final String token;

  const BookingStatusCard({
    super.key,
    required this.booking,
    required this.token,
    this.onCancel,
    this.onEdit,
  });

  @override
  State<BookingStatusCard> createState() => _BookingStatusCardState();
}

class _BookingStatusCardState extends State<BookingStatusCard> {
  Map<String, dynamic>? _managerDetails;
  bool _isLoadingManager = false;

  @override
  void initState() {
    super.initState();
    if (widget.booking.status == 'approved') {
      _fetchManagerDetails();
    }
  }

  Future<void> _fetchManagerDetails() async {
    setState(() { _isLoadingManager = true; });
    final details = await ApiService().getManagerDetails(
      widget.booking.formData['guestRoomCategoryId'],
      widget.token,
    );
    if (mounted) {
      setState(() {
        _managerDetails = details;
        _isLoadingManager = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final booking = widget.booking;
  final String guestHouseName = booking.formData['guestHouseName'] ?? booking.formData['guest_room_name'] ?? 'Booking Details';
    final bool isApproved = booking.status == 'approved';
    final bool isPending = booking.status == 'pending';
    final bool isRejected = booking.status == 'rejected';
    final String? remarks = booking.formData['remarks'];
    final bool hasRemarks = remarks != null && remarks.isNotEmpty;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 8.0),
      elevation: 3,
      shadowColor: Colors.black.withOpacity(0.1),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Do not show the guest house name when booking is still pending (not allotted/approved)
            _buildHeader(isPending ? 'Booking Details' : guestHouseName, booking),
            const Divider(height: 24),
            _buildBookingInfo(booking),
            if (hasRemarks) _buildRemarksInfo(remarks),
            if (isApproved) _buildApprovedInfo(booking),
            if (isRejected) _buildRejectedInfo(booking),
            if (isPending || isApproved) _buildActionButtons(context),
            const Divider(height: 24),
            _buildContactUsButton(context),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(String title, Booking booking) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18), overflow: TextOverflow.ellipsis),
              Text('Booking ID: ${booking.id}', style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
            ],
          ),
        ),
        Chip(
          label: Text(booking.status.toUpperCase(), style: TextStyle(fontWeight: FontWeight.w600, color: _getStatusTextColor(booking.status))),
          backgroundColor: _getStatusColor(booking.status),
          side: BorderSide.none,
          padding: const EdgeInsets.symmetric(horizontal: 8),
        ),
      ],
    );
  }

  Widget _buildBookingInfo(Booking booking) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildInfoRow(icon: Icons.person, label: 'Guest Name', value: booking.formData['name'] ?? 'N/A'),
        const SizedBox(height: 8),
        _buildInfoRow(icon: Icons.calendar_today, label: 'Duration', value: '${booking.formData['dateFrom']} to ${booking.formData['dateTo']}'),
        const SizedBox(height: 8),
        _buildInfoRow(icon: Icons.group, label: 'Guests', value: (booking.formData['numPeople'] ?? 'N/A').toString()),
        const SizedBox(height: 8),
        _buildInfoRow(icon: Icons.meeting_room, label: 'Rooms Req.', value: (booking.formData['numRooms'] ?? 'N/A').toString()),
      ],
    );
  }

  Widget _buildInfoRow({ required IconData icon, required String label, required String value }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: Colors.white70), // Brighter icon
        const SizedBox(width: 12),
        Text(
          '$label: ',
          style: const TextStyle(
            fontWeight: FontWeight.w500,
            color: Colors.white70, // Brighter, non-grey label text
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.normal,
              color: Colors.white, // Explicitly white value text
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildApprovedInfoRow({ required IconData icon, required String label, required String value }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: Colors.black54), // Dark icon for light background
        const SizedBox(width: 12),
        Text(
          '$label: ',
          style: const TextStyle(
            fontWeight: FontWeight.w500,
            color: Colors.black87, // Dark label text
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.normal,
              color: Colors.black, // Explicitly black value text
            ),
          ),
        ),
      ],
    );
  }



  Widget _buildRemarksInfo(String remarks) {
    return Padding(
      padding: const EdgeInsets.only(top: 12.0),
      child: _buildInfoRow(icon: Icons.note, label: 'Your Remarks', value: remarks),
    );
  }
  
  Widget _buildApprovedInfo(Booking booking) {
    final String allottedRooms = booking.formData['allottedRoomNumbers'] ?? 'Awaiting Assignment';
    return Container(
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.green.shade100, // Light green background
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green.shade800, size: 20),
              const SizedBox(width: 8),
              Text(
                'Booking Approved',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.green.shade900, // Dark green title text
                ),
              ),
            ],
          ),
          Divider(height: 16, color: Colors.green.shade200),
          // --- Use the new helper for black text on a light background ---
          _buildApprovedInfoRow(
            icon: Icons.vpn_key,
            label: 'Allotted Room(s)',
            value: allottedRooms,
          ),
          const SizedBox(height: 8),
          _isLoadingManager
              ? const Padding(padding: EdgeInsets.all(8.0), child: Center(child: CircularProgressIndicator(strokeWidth: 2)))
              : Column(
                  children: [
                    _buildApprovedInfoRow(
                        icon: Icons.support_agent,
                        label: 'Manager Name',
                        value: _managerDetails?['managerName'] ?? 'N/A'),
                    const SizedBox(height: 8),
                    _buildApprovedInfoRow(
                        icon: Icons.phone_in_talk,
                        label: 'Manager Contact',
                        value: _managerDetails?['managerContact'] ?? 'N/A'),
                  ],
                ),
        ],
      ),
    );
  }

  // --- THIS IS THE COMPLETE _buildRejectedInfo METHOD ---
  Widget _buildRejectedInfo(Booking booking) {
    return Container(
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.red.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.red.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.cancel, color: Colors.red.shade700, size: 20),
              const SizedBox(width: 8),
              Text(
                'Booking Rejected',
                style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red.shade800),
              ),
            ],
          ),
          if (booking.formData['rejection_reason'] != null) ...[
            const SizedBox(height: 8),
            Text(
              "Reason: ${booking.formData['rejection_reason']}",
              style: TextStyle(color: Colors.red.shade700, fontSize: 13),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          if (widget.booking.status == 'pending' && widget.onEdit != null)
            TextButton.icon(onPressed: widget.onEdit, icon: const Icon(Icons.edit, size: 16), label: const Text('Edit'), style: TextButton.styleFrom(foregroundColor: Colors.blue)),
          const SizedBox(width: 8),
          TextButton.icon(
            onPressed: () => _showCancelDialog(context),
            icon: const Icon(Icons.cancel_outlined, size: 16),
            label: const Text('Cancel Booking'),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
          ),
        ],
      ),
    );
  }
  
  // --- THIS IS THE COMPLETE _buildContactUsButton METHOD ---
  Widget _buildContactUsButton(BuildContext context) {
    return Center(
      child: TextButton.icon(
        onPressed: () {
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              title: const Text('Contact for Queries'),
              content: const SelectableText('For any questions regarding your booking, please contact:\n\nabhyagatcustomercare@gmail.com'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('Close'),
                ),
              ],
            ),
          );
        },
        icon: Icon(Icons.help_outline, size: 16, color: Colors.grey.shade700),
        label: Text('Having an issue?', style: TextStyle(color: Colors.grey.shade700)),
      ),
    );
  }

  void _showCancelDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel Booking'),
        content: const Text('Are you sure you want to cancel this booking? This action cannot be undone.'),
        actions: [
          TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Keep Booking')),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              widget.onCancel?.call();
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Yes, Cancel'),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending': return Colors.orange.shade100;
      case 'approved': return Colors.green.shade100;
      case 'rejected': return Colors.red.shade100;
      case 'cancelled': return Colors.grey.shade200;
      default: return Colors.grey.shade100;
    }
  }

  Color _getStatusTextColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending': return Colors.orange.shade800;
      case 'approved': return Colors.green.shade800;
      case 'rejected': return Colors.red.shade800;
      case 'cancelled': return Colors.grey.shade700;
      default: return Colors.grey.shade800;
    }
  }
}