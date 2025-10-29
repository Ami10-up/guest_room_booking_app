import 'dart:async';
import 'package:atithi_bhavan_mobile/screens/login_screen.dart';
import 'package:flutter/material.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

// --- We add 'SingleTickerProviderStateMixin' to allow the widget to host animations ---
class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  // The controller that drives the animation from 0.0 to 1.0
  late AnimationController _controller;
  // The animation that will control the reveal effect
  late Animation<double> _revealAnimation;

  @override
  void initState() {
    super.initState();

    // 1. Initialize the AnimationController
    _controller = AnimationController(
      // The vsync prevents offscreen animations from consuming resources
      vsync: this,
      // The animation will take 2.5 seconds to complete
      duration: const Duration(milliseconds: 2500),
    );

    // 2. Create the reveal animation
    // It will smoothly go from 0.0 (hidden) to 1.0 (fully visible)
    _revealAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    // 3. Start the animation
    _controller.forward();

    // 4. Navigate to the login screen after a 3-second delay
    Timer(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
        );
      }
    });
  }

  @override
  void dispose() {
    // It's crucial to dispose of the controller to prevent memory leaks
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Your existing background image
          Image.asset(
            'assets/background.jpg',
            fit: BoxFit.cover,
            color: Colors.black.withOpacity(0.70),
            colorBlendMode: BlendMode.darken,
          ),
          
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Your existing animated app name
                TweenAnimationBuilder(
                  tween: Tween<double>(begin: 0, end: 1),
                  duration: const Duration(milliseconds: 2000),
                  curve: Curves.easeIn,
                  child: const Text(
                    'ABHYAGAT',
                    style: TextStyle(
                      fontFamily: 'BodoniModa',
                      fontSize: 42,
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 2,
                    ),
                  ),
                  builder: (context, double opacity, child) {
                    return Opacity(opacity: opacity, child: child);
                  },
                ),
                
                const SizedBox(height: 80), // Space between title and sticker

                // --- THIS IS THE NEW REVEAL ANIMATION WIDGET ---
                // We wrap our sticker in an AnimatedBuilder to listen for changes
                AnimatedBuilder(
                  animation: _revealAnimation,
                  builder: (context, child) {
                    return ClipRect(
                      // The clipper will only show a portion of the sticker
                      child: Align(
                        alignment: Alignment.bottomCenter,
                        // The heightFactor is controlled by our animation (goes from 0.0 to 1.0)
                        heightFactor: _revealAnimation.value,
                        child: child,
                      ),
                    );
                  },
                  // This is the actual sticker widget that will be revealed
                  child: Image.asset(
                    'assets/sticker.png', // Make sure your sticker is named this
                    width: 150, // Adjust the size of your sticker as needed
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}