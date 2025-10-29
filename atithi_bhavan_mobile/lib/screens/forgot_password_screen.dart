// lib/screens/forgot_password_screen.dart

import 'package:atithi_bhavan_mobile/services/api_service.dart';
import 'package:flutter/material.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final PageController _pageController = PageController();
  final ApiService _apiService = ApiService();

  // Controllers for all form fields
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _answerController = TextEditingController();
  final TextEditingController _newPasswordController = TextEditingController();

  // State variables
  bool _isLoading = false;
  String _errorMessage = '';
  String _securityQuestion = '';

  // Step 1: Fetch security question based on username
  Future<void> _fetchQuestion() async {
    if (_usernameController.text.isEmpty) {
      setState(() { _errorMessage = "Please enter a username."; });
      return;
    }
    setState(() { _isLoading = true; _errorMessage = ''; });

    final question = await _apiService.getSecurityQuestion(_usernameController.text);
    
    setState(() { _isLoading = false; });

    if (question != null && mounted) {
      setState(() {
        _securityQuestion = question;
        _pageController.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeIn);
      });
    } else {
      setState(() { _errorMessage = "User not found or no security question set."; });
    }
  }

  // Step 2 & 3: Verify answer and reset password
  Future<void> _resetPassword() async {
    if (_answerController.text.isEmpty || _newPasswordController.text.isEmpty) {
      setState(() { _errorMessage = "Please fill in all fields."; });
      return;
    }
    if (_newPasswordController.text.length < 6) {
      setState(() { _errorMessage = "Password must be at least 6 characters long."; });
      return;
    }
    setState(() { _isLoading = true; _errorMessage = ''; });

    final success = await _apiService.resetPassword(
      username: _usernameController.text,
      securityAnswer: _answerController.text,
      newPassword: _newPasswordController.text,
    );

    setState(() { _isLoading = false; });

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Password reset successfully. You can now log in."), backgroundColor: Colors.green),
      );
      Navigator.of(context).pop(); // Go back to login screen
    } else {
      setState(() { _errorMessage = "Incorrect security answer or server error."; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reset Password')),
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(), // Disable swiping between pages
        children: [
          _buildStep1EnterUsername(),
          _buildStep2AnswerQuestion(),
        ],
      ),
    );
  }

  Widget _buildStep1EnterUsername() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            "Find Your Account",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          const Text(
            "Please enter your username to find your security question.",
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          TextField(
            controller: _usernameController,
            decoration: const InputDecoration(labelText: 'Username', prefixIcon: Icon(Icons.person)),
          ),
          const SizedBox(height: 24),
          if (_errorMessage.isNotEmpty)
            Text(_errorMessage, style: const TextStyle(color: Colors.red), textAlign: TextAlign.center),
          const SizedBox(height: 8),
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : ElevatedButton(
                  onPressed: _fetchQuestion,
                  child: const Text('Find Account'),
                ),
        ],
      ),
    );
  }

  Widget _buildStep2AnswerQuestion() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            "Security Verification",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          // Display the security question fetched from the server
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: Theme.of(context).primaryColor.withOpacity(0.2),
            ),
            child: Text(
              _securityQuestion,
              style: const TextStyle(fontSize: 16, fontStyle: FontStyle.italic),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 24),
          TextField(
            controller: _answerController,
            decoration: const InputDecoration(labelText: 'Your Answer', prefixIcon: Icon(Icons.lock_open)),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _newPasswordController,
            decoration: const InputDecoration(labelText: 'New Password', prefixIcon: Icon(Icons.lock)),
            obscureText: true,
          ),
          const SizedBox(height: 24),
          if (_errorMessage.isNotEmpty)
            Text(_errorMessage, style: const TextStyle(color: Colors.red), textAlign: TextAlign.center),
          const SizedBox(height: 8),
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : ElevatedButton(
                  onPressed: _resetPassword,
                  child: const Text('Reset Password'),
                ),
        ],
      ),
    );
  }
}