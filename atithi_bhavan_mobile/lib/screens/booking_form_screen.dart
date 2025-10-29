// lib/screens/booking_form_screen.dart

import 'package:atithi_bhavan_mobile/models/app_models.dart';
import 'package:atithi_bhavan_mobile/services/api_service.dart';
import 'package:flutter/material.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

class BookingFormScreen extends StatefulWidget {
  final String token;
  final int userId;

  const BookingFormScreen({super.key, required this.token, required this.userId});

  @override
  State<BookingFormScreen> createState() => _BookingFormScreenState();
}

class _BookingFormScreenState extends State<BookingFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final ApiService _apiService = ApiService();

  // --- Form State is now much simpler ---
  ReasonForVisit? _selectedReason;
  DateTime? _fromDate;
  DateTime? _toDate;
  final _nameController = TextEditingController();
  final _contactController = TextEditingController();
  final _appointmentController = TextEditingController();
  final _numRoomsController = TextEditingController(text: "1");
  final _numPeopleController = TextEditingController(text: "1");
  final _idController = TextEditingController();
  final _reasonOtherController = TextEditingController();
  final _remarksController = TextEditingController();
  
  bool _isSubmitting = false;

  // No initState or _fetchCategories needed anymore

  @override
  void dispose() {
    _nameController.dispose();
    _contactController.dispose();
    _appointmentController.dispose();
    _numRoomsController.dispose();
    _numPeopleController.dispose();
    _idController.dispose();
    _reasonOtherController.dispose();
    _remarksController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context, bool isFromDate) async {
    final picked = await showDatePicker(
        context: context,
        initialDate: _fromDate ?? DateTime.now(),
        firstDate: DateTime.now(),
        lastDate: DateTime(2030));
    if (!mounted || picked == null) return;
    setState(() {
      if (isFromDate) {
        _fromDate = picked;
        if (_toDate != null && _toDate!.isBefore(_fromDate!)) {
          _toDate = null;
        }
      } else {
        _toDate = picked;
      }
    });
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }
    setState(() { _isSubmitting = true; });
    
    // The form data is now simplified
    final Map<String, dynamic> formData = {
      "userId": widget.userId,
      "rank": "Officer", // Hardcoded to Officer
      "name": _nameController.text,
      "contactNo": _contactController.text,
      "presentAppointment": _appointmentController.text,
      "idNo": _idController.text,
      "dateFrom": _fromDate!.toIso8601String().split('T')[0],
      "dateTo": _toDate!.toIso8601String().split('T')[0],
      "reason": _selectedReason == ReasonForVisit.other ? _reasonOtherController.text : _selectedReason!.displayName,
      "remarks": _remarksController.text,
      "guestRoomCategoryId": 1, // Send a placeholder ID; admin will choose
      "guest_room_name": "General Request", // Send a placeholder name
      "numRooms": int.parse(_numRoomsController.text),
      "numPeople": int.parse(_numPeopleController.text),
    };

    final Booking? newBooking = await _apiService.submitBooking(formData, widget.token);

    if (mounted) {
      if (newBooking != null) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Booking request sent!"), backgroundColor: Colors.green));
        await _generateAndShowPdf(formData, newBooking.id);
        Navigator.of(context).pop(true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Booking submission failed. Please try again."), backgroundColor: Colors.red));
      }
      setState(() { _isSubmitting = false; });
    }
  }
  
  Future<void> _generateAndShowPdf(Map<String, dynamic> data, int bookingId) async {
    // ... (This function is correct and does not need changes)
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("New Booking Request")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // --- Simplified Form UI ---
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Full Name with Rank', prefixIcon: Icon(Icons.person)),
                validator: (val) {
                  if (val == null || val.isEmpty) return 'Required';
                  if (!RegExp(r'^[a-zA-Z\s]+$').hasMatch(val)) return 'Please enter only alphabets and spaces.';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              // 'Service Category' Dropdown has been removed
              TextFormField(
                controller: _contactController,
                decoration: const InputDecoration(labelText: 'Contact No.', prefixIcon: Icon(Icons.phone)),
                keyboardType: TextInputType.phone,
                validator: (val) {
                  if (val == null || val.isEmpty) return 'Required';
                  if (!RegExp(r'^\d{10}$').hasMatch(val)) return 'Please enter a valid 10-digit number.';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _idController,
                decoration: const InputDecoration(labelText: 'ID No.', prefixIcon: Icon(Icons.badge)),
                validator: (val) => val!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _appointmentController,
                decoration: const InputDecoration(labelText: 'Present Appointment', prefixIcon: Icon(Icons.work)),
                validator: (val) => val!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(child: InputDecorator(
                    decoration: const InputDecoration(labelText: 'From Date', prefixIcon: Icon(Icons.calendar_today)),
                    child: TextButton(onPressed: () => _selectDate(context, true), child: Text(_fromDate?.toIso8601String().split('T')[0] ?? 'Select')),
                  )),
                  const SizedBox(width: 10),
                  Expanded(child: InputDecorator(
                    decoration: const InputDecoration(labelText: 'To Date', prefixIcon: Icon(Icons.calendar_today)),
                    child: TextButton(onPressed: () => _selectDate(context, false), child: Text(_toDate?.toIso8601String().split('T')[0] ?? 'Select')),
                  )),
                ],
              ),
              const SizedBox(height: 16),
              // 'Guest House' Dropdown has been removed
              // Vacancy check display has been removed
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _numRoomsController,
                      decoration: const InputDecoration(labelText: 'No. of Rooms', prefixIcon: Icon(Icons.meeting_room)),
                      keyboardType: TextInputType.number,
                      validator: (val) {
                        if (val == null || val.isEmpty) return 'Required';
                        if (int.tryParse(val) == null || int.parse(val) <= 0) return 'Invalid number';
                        return null;
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _numPeopleController,
                      decoration: const InputDecoration(labelText: 'No. of People', prefixIcon: Icon(Icons.group)),
                      keyboardType: TextInputType.number,
                      validator: (val) {
                        if (val == null || val.isEmpty) return 'Required';
                        final people = int.tryParse(val);
                        final rooms = int.tryParse(_numRoomsController.text) ?? 1;
                        if (people == null || people <= 0) return 'Invalid number';
                        if ((people / rooms) > 5) return 'Max 5 people per room.';
                        return null;
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<ReasonForVisit>(
                value: _selectedReason,
                decoration: const InputDecoration(labelText: 'Reason for Visit', prefixIcon: Icon(Icons.info)),
                items: ReasonForVisit.values.map((r) => DropdownMenuItem(value: r, child: Text(r.displayName))).toList(),
                onChanged: (val) => setState(() => _selectedReason = val),
                validator: (val) => val == null ? 'Required' : null,
              ),
              if (_selectedReason == ReasonForVisit.other)
                Padding(
                  padding: const EdgeInsets.only(top: 16.0),
                  child: TextFormField(
                    controller: _reasonOtherController,
                    decoration: const InputDecoration(labelText: 'Specify Other Reason'),
                    validator: (val) => val!.isEmpty ? 'Required' : null,
                  ),
                ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _remarksController,
                decoration: const InputDecoration(labelText: 'Additional Remarks (Optional)', prefixIcon: Icon(Icons.note_add)),
                maxLines: 3,
              ),
              const SizedBox(height: 32),
              _isSubmitting
                ? const Center(child: CircularProgressIndicator())
                : ElevatedButton(
                    // Button is now always enabled
                    onPressed: _isSubmitting ? null : _submitForm,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Submit Request', style: TextStyle(fontSize: 18)),
                  ),
            ],
          ),
        ),
      ),
    );
  }
}