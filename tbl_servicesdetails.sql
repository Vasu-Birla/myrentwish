-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 01, 2024 at 07:53 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myrentwish`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_servicesdetails`
--

CREATE TABLE `tbl_servicesdetails` (
  `id` int(11) NOT NULL,
  `terms` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_servicesdetails`
--

INSERT INTO `tbl_servicesdetails` (`id`, `terms`) VALUES
(1, '<p><strong>Terms and Conditions for Myrentwish</strong></p>\r\n\r\n<p><strong>Last Updated: [Date]</strong></p>\r\n\r\n<p>Welcome to Myrentwish! These Terms and Conditions (&quot;Terms&quot;) govern your use of the Myrentwish platform. By accessing or using our services, you agree to comply with these Terms.</p>\r\n\r\n<p><strong>1. User Eligibility:</strong></p>\r\n\r\n<p>You must be at least 18 years old and capable of forming a legally binding contract to use Myrentwish. By accessing or using our services, you confirm that you meet these eligibility requirements.</p>\r\n\r\n<p><strong>2. Account Registration:</strong></p>\r\n\r\n<p>To access certain features, you may need to create an account. Provide accurate and complete information during registration and keep your account information updated.</p>\r\n\r\n<p><strong>3. Property Listings:</strong></p>\r\n\r\n<p>If you list a property, you agree to provide accurate and up-to-date information about the property. Myrentwish reserves the right to remove any listing that violates these Terms or local laws.</p>\r\n\r\n<p><strong>4. User Conduct:</strong></p>\r\n\r\n<p>You agree not to engage in any activities that violate these Terms or applicable laws. This includes, but is not limited to, fraudulent activities, harassment, or any behavior that disrupts the normal functioning of the platform.</p>\r\n\r\n<p><strong>5. Payments:</strong></p>\r\n\r\n<p>For transactions conducted on the platform, you agree to abide by the payment terms outlined during the transaction process. Myrentwish may use third-party payment processors for secure transactions.</p>\r\n\r\n<p><strong>6. Privacy:</strong></p>\r\n\r\n<p>Your use of Myrentwish is subject to our Privacy Policy. By using our services, you consent to the collection, use, and sharing of your information as described in the Privacy Policy.</p>\r\n\r\n<p><strong>7. Intellectual Property:</strong></p>\r\n\r\n<p>Myrentwish retains ownership of all intellectual property associated with the platform. You may not use our trademarks, logos, or other proprietary materials without our written consent.</p>\r\n\r\n<p><strong>8. Termination:</strong></p>\r\n\r\n<p>Myrentwish reserves the right to suspend or terminate your account if you violate these Terms or engage in activities that could harm the platform or other users.</p>\r\n\r\n<p><strong>9. Disclaimer of Warranties:</strong></p>\r\n\r\n<p>Myrentwish provides services &quot;as is&quot; and makes no warranties or representations regarding the accuracy, completeness, or suitability of the information on the platform.</p>\r\n\r\n<p><strong>10. Limitation of Liability:</strong></p>\r\n\r\n<p>Myrentwish is not liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of the platform or any interactions with other users.</p>\r\n\r\n<p><strong>11. Changes to Terms:</strong></p>\r\n\r\n<p>Myrentwish may update these Terms from time to time. Continued use of the platform after the effective date of changes constitutes acceptance of the modified Terms.</p>\r\n\r\n<p><strong>12. Governing Law:</strong></p>\r\n\r\n<p>These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from or relating to these Terms will be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].</p>\r\n\r\n<p><strong>Contact Us:</strong></p>\r\n\r\n<p>If you have questions about these Terms, please contact us at [your contact information].</p>\r\n\r\n<p>Thank you for using Myrentwish!</p>\r\n\r\n<hr />\r\n<p>Replace <code>[Date]</code> and <code>[your contact information]</code> with the appropriate details. Customize the terms to suit the specific nature of your platform and comply with local regulations.</p>\r\n');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_servicesdetails`
--
ALTER TABLE `tbl_servicesdetails`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_servicesdetails`
--
ALTER TABLE `tbl_servicesdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
