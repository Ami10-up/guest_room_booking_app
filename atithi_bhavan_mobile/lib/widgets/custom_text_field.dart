// lib/widgets/custom_text_field.dart
import 'package:flutter/material.dart';

class CustomTextField extends StatelessWidget {
  final String labelText;
  final IconData? prefixIcon;
  final bool obscureText;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final TextInputType? keyboardType;

  const CustomTextField({
    super.key,
    required this.labelText,
    this.prefixIcon,
    this.obscureText = false,
    this.controller,
    this.validator,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      validator: validator,

      // --- THIS IS THE FIX ---
      // This tells the text field what style to use for the text the user types.
      // It will use the default text color from the theme, which is white/light grey
      // on a dark theme, so we don't need to specify a color here. Flutter handles it.
      // However, to be explicit if you wanted black text, you would do:
      // style: const TextStyle(color: Colors.black),
      // But letting the theme handle it is better practice.
      // For the dark theme we defined, the default text is already a contrasting color.
      // The issue is likely the 'fillColor' being too bright. Let's adjust that.
      
      style: TextStyle(color: Theme.of(context).textTheme.bodyLarge?.color), // Ensures text uses theme's default color

      decoration: InputDecoration(
        labelText: labelText,
        prefixIcon: prefixIcon != null ? Icon(prefixIcon, color: Colors.grey.shade400) : null,
        // The fillColor was likely the issue, let's use a darker shade from our theme.
        fillColor: Theme.of(context).primaryColor, // Use a darker color from our theme
        filled: true,
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
          borderSide: const BorderSide(color: Colors.blueAccent, width: 2),
        ),
        labelStyle: TextStyle(color: Colors.grey.shade400),
      ),
    );
  }
}