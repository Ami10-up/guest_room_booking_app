// lib/main.dart
// import 'package:atithi_bhavan_mobile/screens/admin_dashboard_screen.dart';
// import 'package.atithi_bhavan_mobile/screens/admin_login_screen.dart';
import 'package:atithi_bhavan_mobile/screens/login_screen.dart';
import 'package:atithi_bhavan_mobile/screens/registration_screen.dart';
import 'package:atithi_bhavan_mobile/screens/splash_screen.dart';
// We no longer import user_dashboard_screen here because it's not accessed via a static route.
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  // Load environment variables from .env.development by default.
  try {
    await dotenv.load(fileName: ".env.development");
  } catch (e) {
    // If the environment file is missing or fails to load, proceed with defaults.
    // This prevents an unhandled exception during app startup.
    // You can log or show this during development for visibility.
    // ignore: avoid_print
    print('Warning: .env.development not found or failed to load: $e');
  }
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Abhyagat',
      debugShowCheckedModeBanner: false,
      // In lib/main.dart, inside the MyApp class -> build method

      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF2C3E50),
        scaffoldBackgroundColor: const Color(0xFF1E2A38),
        
        // Use a color scheme for more consistent coloring
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF3498DB), // A brighter blue for accents
          secondary: Color(0xFF3498DB),
          surface: Color(0xFF2C3E50), // Color of cards, dialogs, etc.
        ),
        
        textTheme: const TextTheme(
          // This styles the text the user types
          titleMedium: TextStyle(color: Colors.white), 
        ),

        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF34495E),
          elevation: 4,
        ),
        
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF3498DB),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            padding: const EdgeInsets.symmetric(vertical: 16),
          ),
        ),

        // --- THIS IS THE CORRECTED AND ENHANCED THEME for input fields ---
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF2C3E50),
          
          // Style for the label text (e.g., "Full Name") when it's floating above
          labelStyle: TextStyle(color: Colors.grey.shade400),
          
          // Style for helper text or error text
          helperStyle: TextStyle(color: Colors.grey.shade400),
          
          // --- FIX: Make icons white ---
          prefixIconColor: Colors.white70,
          
          // Define the border styles
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey.shade700),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF3498DB), width: 2),
          ),
        ),

        // --- FIX: Theme for Dropdown Menus ---
        dropdownMenuTheme: DropdownMenuThemeData(
          inputDecorationTheme: InputDecorationTheme(
            labelStyle: TextStyle(color: Colors.grey.shade400),
            filled: true,
            fillColor: const Color(0xFF2C3E50),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
          )
        ),

        // --- FIX: Theme for Date Picker Buttons ---
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: Colors.white, // Make the text inside TextButtons white
          )
        ),
      ),

// ... (rest of the MaterialApp)

      // The app will always start on the splash screen.
      initialRoute: '/splash',

      // These are the static routes that do not require any data to be passed.
      routes: {
        '/splash': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegistrationScreen(),
        
        // --- THE '/home' ROUTE HAS BEEN REMOVED ---
        // Navigation to the UserHomeScreen is now handled dynamically
        // by the LoginScreen after a successful login. This is because
        // the UserHomeScreen requires user data and a token, which
        // are not available at app startup.

        // Admin routes can remain static if they don't need initial data.
        // '/adminLogin': (context) => const AdminLoginScreen(),
        // '/adminDashboard': (context) => const AdminDashboardScreen(),
      },
    );
  }
}