// lib/screens/registration_screen.dart
import 'package:atithi_bhavan_mobile/services/api_service.dart';
import 'package:atithi_bhavan_mobile/widgets/custom_text_field.dart';
import 'package:flutter/material.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({super.key});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final ApiService _apiService = ApiService();

  final _nameController = TextEditingController();
  final _contactController = TextEditingController();
  final _idController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  // final _rankController = TextEditingController();
  final _appointmentController = TextEditingController();
  final _securityQuestionController = TextEditingController();
  final _securityAnswerController = TextEditingController();

  bool _isLoading = false;

  void _handleRegistration() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      // --- FIX: Ensure these keys EXACTLY match the backend controller ---
      final userData = {
        "fullName": _nameController.text,
        "contactNo": _contactController.text, // Was 'contactNumber'
        "idNo": _idController.text,
        "username": _usernameController.text,
        "password": _passwordController.text,
        "rank": "Officer",
        "presentAppointment": _appointmentController.text,
        "role": "user" ,// Add the default role as the backend requires it
        "securityQuestion": _securityQuestionController.text,
        "securityAnswer": _securityAnswerController.text,
    
      };

      final result = await _apiService.registerUser(userData: userData);

      setState(() {
        _isLoading = false;
      });

      if (!mounted) return;

      if (result['statusCode'] == 201) {
        // Success
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Registration successful! Please log in.'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.of(context).pop();
      } else {
        // Failure
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Registration failed: ${result['body']['message']}"),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: const Text('Create New Account'),
    ),
    body: Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              const Text(
                'Register',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 40),
              CustomTextField(
                controller: _nameController,
                labelText: 'Full Name',
                prefixIcon: Icons.person_outline,
                // RULE 2a: Alphabets and spaces only
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Please enter your full name';
                  if (!RegExp(r'^[a-zA-Z\s]+$').hasMatch(value)) return 'Please enter only alphabets and spaces.';
                  return null;
                },
              ),
              
              const SizedBox(height: 20),
              // CustomTextField(
              //   controller: _rankController,
              //   labelText: 'Rank (e.g., Officer, JCO, OR)',
              //   prefixIcon: Icons.star_border,
              //   validator: (v) => v!.isEmpty ? 'Rank is required' : null,
              // ),
              const SizedBox(height: 20),
              CustomTextField(
                controller: _contactController,
                labelText: 'Contact Number',
                prefixIcon: Icons.phone_outlined,
                keyboardType: TextInputType.phone,
                // RULE 2b: 10 digits only
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Please enter your contact number';
                  if (!RegExp(r'^\d{10}$').hasMatch(value)) return 'Please enter a valid 10-digit number.';
                  return null;
                },
              ),
              const SizedBox(height: 20),
              CustomTextField(
                controller: _idController,
                labelText: 'ID Number',
                prefixIcon: Icons.badge_outlined,
                validator: (v) => v!.isEmpty ? 'ID Number is required' : null,
              ),
              const SizedBox(height: 20),
              CustomTextField(
                controller: _appointmentController,
                labelText: 'Present Appointment',
                prefixIcon: Icons.work_outline,
                validator: (v) => v!.isEmpty ? 'Appointment is required' : null,
              ),
              const SizedBox(height: 20),
              CustomTextField(
                controller: _usernameController,
                labelText: 'Username',
                prefixIcon: Icons.account_circle_outlined,
                // RULE 3: Alphanumeric and underscore only
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Please choose a username';
                  if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(value)) return 'No spaces or special characters allowed.';
                  return null;
                },
              ),
              const SizedBox(height: 20),
              CustomTextField(
                controller: _passwordController,
                labelText: 'Password',
                prefixIcon: Icons.lock_outline,
                obscureText: true,
                validator: (v) => v!.isEmpty ? 'Password is required' : null,
              ),
              const SizedBox(height: 20),
              CustomTextField(
                controller: _securityQuestionController,
                labelText: 'Security Question',
                prefixIcon: Icons.help_outline,
                validator: (v) => v!.isEmpty ? 'Question is required' : null,
              ),
              const SizedBox(height: 20),
              CustomTextField(
                controller: _securityAnswerController,
                labelText: 'Security Answer',
                prefixIcon: Icons.lock_person_outlined,
                validator: (v) => v!.isEmpty ? 'Answer is required' : null,
              ),
              const SizedBox(height: 30),
              _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: _handleRegistration,
                      child: const Text('Register', style: TextStyle(fontSize: 18)),
                    ),
            ],
          ),
        ),
      ),
    ),
  );
}
}