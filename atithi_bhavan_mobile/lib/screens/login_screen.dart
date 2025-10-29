// lib/screens/login_screen.dart

import 'package:atithi_bhavan_mobile/screens/registration_screen.dart';
import 'package:atithi_bhavan_mobile/screens/user_dashboard_screen.dart';
import 'package:atithi_bhavan_mobile/services/api_service.dart';
import 'package:atithi_bhavan_mobile/widgets/custom_text_field.dart';
import 'package:flutter/material.dart';
import 'forgot_password_screen.dart';
// import 'admin_login_screen.dart'; // Assuming this file exists

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final ApiService _apiService = ApiService();
  bool _isLoading = false;

  void _handleLogin() async {
    setState(() {
      _isLoading = true;
    });

    final username = _usernameController.text;
    final password = _passwordController.text;

    final result = await _apiService.loginUser(username, password);

    setState(() {
      _isLoading = false;
    });

    if (result != null && mounted) {
      // Login Successful
      final token = result['token'];
      final userData = result['user'];
      
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => UserHomeScreen(userData: userData, token: token),
        ),
      );
    } else if (mounted) {
      // Login Failed
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Login failed. Please check your username and password."),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              const Text(
                'Welcome Back',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'Login to continue',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18, color: Colors.grey),
              ),
              const SizedBox(height: 40),
              CustomTextField(
                controller: _usernameController,
                labelText: 'Username',
                prefixIcon: Icons.person,
              ),
              const SizedBox(height: 20),
              CustomTextField(
                controller: _passwordController,
                labelText: 'Password',
                prefixIcon: Icons.lock,
                obscureText: true,
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
                      onPressed: _handleLogin,
                      child: const Text('Login', style: TextStyle(fontSize: 18)),
                    ),
              const SizedBox(height: 10),
              TextButton(
                onPressed: _isLoading ? null : () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const RegistrationScreen()),
                  );
                },
                child: const Text("Don't have an account? Register"),
              ),
              // TextButton(
              //   onPressed: _isLoading ? null : () {
              //     Navigator.of(context).push(
              //       MaterialPageRoute(builder: (_) => const AdminLoginScreen()),
              //     );
                
              //   },
              //   child: const Text(
              //     "Admin Login",
              //     style: TextStyle(color: Colors.grey),
              //   ),
                
              // ),
              TextButton(
                onPressed: _isLoading ? null : () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const ForgotPasswordScreen()),
                  );
                },
                child: const Text("Forgot Password?"),
              ),

            ],
          ),
        ),
      ),
    );
  }
}