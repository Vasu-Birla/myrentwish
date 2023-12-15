-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 15, 2023 at 01:53 PM
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
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `user_from` varchar(255) NOT NULL,
  `user_to` varchar(255) NOT NULL,
  `message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(255) NOT NULL,
  `filePath` longtext NOT NULL,
  `mimetype` varchar(255) NOT NULL,
  `thumbnail` text NOT NULL,
  `timestamp` varchar(255) NOT NULL,
  `userStatus` varchar(255) NOT NULL,
  `readStaus` varchar(255) NOT NULL DEFAULT 'false'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `user_from`, `user_to`, `message`, `filename`, `filePath`, `mimetype`, `thumbnail`, `timestamp`, `userStatus`, `readStaus`) VALUES
(7, '8', '12', 'Hello, user 12 kya haal chal?', '', '', 'txt', '', '2023-12-15 04:36 PM', 'online', 'true'),
(8, '8', '12', 'Hello, user 12 kya haal chal?', '', '', 'txt', '', '2023-12-15 04:36 PM', 'online', 'true'),
(9, '8', '12', 'Hello, user 12 kya haal chal?', '', '', 'txt', '', '2023-12-15 04:52 PM', 'online', 'true'),
(10, '8', '12', 'Hello, user 12 kya haal chal?', '', '', 'txt', '', '2023-12-15 05:01 PM', 'online', 'false');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_admin`
--

CREATE TABLE `tbl_admin` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `about` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `imagePath` varchar(255) NOT NULL,
  `date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_admin`
--

INSERT INTO `tbl_admin` (`id`, `firstname`, `lastname`, `email`, `username`, `password`, `contact`, `about`, `address`, `image`, `imagePath`, `date`) VALUES
(1, 'Kilvish', 'Cisss', 'kilvishbirla@gmail.com', 'admin', '123456', '9039568219', 'CISS Invoice Management System can be a robust and useful addition, allowing administrators to manage users, invoices, and other essential functions. Below are some key features and considerations for your admin panel:', 'Indore', 'img_tonystark.jpg_1702387978539.jpg', 'public\\uploads\\img_tonystark.jpg_1702387978539.jpg', '2023-08-14 12:15:42.000000');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_apppass`
--

CREATE TABLE `tbl_apppass` (
  `id` int(11) NOT NULL,
  `appEmail` varchar(255) NOT NULL,
  `appPassword` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_apppass`
--

INSERT INTO `tbl_apppass` (`id`, `appEmail`, `appPassword`, `created_at`, `updated_at`) VALUES
(1, 'vasubirla@gmail.com', 'mtvrqzmxlarnrgzh', '2023-12-13 13:10:10', '2023-12-13 13:23:24');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_customerprivacy`
--

CREATE TABLE `tbl_customerprivacy` (
  `id` int(11) NOT NULL,
  `policy` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_customerprivacy`
--

INSERT INTO `tbl_customerprivacy` (`id`, `policy`) VALUES
(1, '<p><strong>User Privacy Policy for Myrentwish</strong></p>\r\n\r\n<p><strong>Last Updated: [Date]</strong></p>\r\n\r\n<p>Welcome to Myrentwish! This Privacy Policy describes how we collect, use, and share your personal information when you use our platform to rent or rent out properties.</p>\r\n\r\n<p><strong>1. Information We Collect:</strong></p>\r\n\r\n<p>We collect the following types of information when you use Myrentwish:</p>\r\n\r\n<ul>\r\n	<li>\r\n	<p><strong>User Information:</strong> When you create an account, we collect your name, email address, and other relevant information to provide our services.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Property Details:</strong> If you list a property, we collect information such as property details, location, rental terms, and other details necessary for property listings.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Payment Information:</strong> When making or receiving payments, we collect payment details to facilitate transactions securely.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Communication Data:</strong> We collect information from your communications with other users on the platform, including messages and interactions.</p>\r\n	</li>\r\n</ul>\r\n\r\n<p><strong>2. How We Use Your Information:</strong></p>\r\n\r\n<p>We use your information for the following purposes:</p>\r\n\r\n<ul>\r\n	<li>\r\n	<p><strong>Providing Services:</strong> To facilitate property rentals, including connecting users, processing transactions, and managing property listings.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Communication:</strong> To communicate with you regarding your account, property listings, and relevant updates.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Improving Services:</strong> To analyze user behavior and preferences, improve our services, and enhance user experience.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Legal Compliance:</strong> To comply with legal obligations, resolve disputes, and enforce our policies.</p>\r\n	</li>\r\n</ul>\r\n\r\n<p><strong>3. Information Sharing:</strong></p>\r\n\r\n<p>We may share your information with third parties under the following circumstances:</p>\r\n\r\n<ul>\r\n	<li>\r\n	<p><strong>With Other Users:</strong> Sharing necessary information with other users involved in a property transaction.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Service Providers:</strong> Engaging third-party service providers to assist with services like payment processing.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Legal Compliance:</strong> Disclosing information as required by law or in response to legal requests.</p>\r\n	</li>\r\n</ul>\r\n\r\n<p><strong>4. Data Security:</strong></p>\r\n\r\n<p>We take measures to protect your information, but no data transmission over the internet is entirely secure. Please take steps to keep your account information secure.</p>\r\n\r\n<p><strong>5. Your Choices:</strong></p>\r\n\r\n<p>You can manage your account settings and preferences through the platform. If you wish to delete your account, please contact us.</p>\r\n\r\n<p><strong>6. Updates to this Privacy Policy:</strong></p>\r\n\r\n<p>We may update this Privacy Policy to reflect changes in our practices. Check the policy periodically for updates.</p>\r\n\r\n<p><strong>7. Contact Us:</strong></p>\r\n\r\n<p>If you have questions about this Privacy Policy or your privacy on Myrentwish, please contact us at [your contact information].</p>\r\n\r\n<p>Thank you for using Myrentwish!</p>\r\n');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_faq`
--

CREATE TABLE `tbl_faq` (
  `faq_id` int(11) NOT NULL,
  `faq` text NOT NULL,
  `answer` text NOT NULL,
  `faq_type` enum('landlord','tenant') NOT NULL DEFAULT 'tenant',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_faq`
--

INSERT INTO `tbl_faq` (`faq_id`, `faq`, `answer`, `faq_type`, `created_at`) VALUES
(66, 'How can I list my property on Myrentwish ?', 'To list your property, sign in to your account, go to the \"My Properties\" section, and follow the prompts to add a new listing. Provide accurate details and images to showcase your property effectively.', 'tenant', '2023-12-11 11:54:21'),
(67, 'Can I rent multiple properties using the same account? ?', 'Yes, you can list and manage multiple properties using a single Myrentwish account. Simply add each property through your account dashboard.', 'tenant', '2023-12-11 11:54:42'),
(68, 'How do I search for properties on Myrentwish?', 'You can use the search bar on the homepage to enter location, price range, and other filters. Additionally, you can explore the \"Properties\" section for a comprehensive list of available properties.', 'tenant', '2023-12-11 11:55:02'),
(69, 'What payment methods are accepted on Myrentwish?', 'Myrentwish supports various payment methods. During the booking process, you\'ll see the available payment options, including credit/debit cards and other secure methods.', 'tenant', '2023-12-11 11:55:15'),
(70, 'Can I communicate with property owners before booking?', 'Yes, you can use the messaging feature on Myrentwish to communicate with property owners. This helps clarify any queries you may have before finalizing a booking.', 'tenant', '2023-12-11 11:55:46'),
(71, 'How does Myrentwish ensure the security of my personal information?', 'Myrentwish prioritizes user data security. We employ industry-standard encryption and security measures to protect your personal information. Refer to our Privacy Policy for more details.\r\n\r\n', 'tenant', '2023-12-11 11:56:03'),
(72, 'What should I do if I encounter issues during a property booking?', 'If you face any issues, reach out to our customer support team through the \"Contact Us\" page. We\'re here to assist you with any challenges you may encounter.', 'tenant', '2023-12-11 11:56:20'),
(73, 'Are there any additional fees beyond the listed property price?', 'The property listing will specify any additional fees, such as cleaning fees or service charges. Review the listing details and booking confirmation to understand the complete cost.', 'tenant', '2023-12-11 11:56:47'),
(74, 'Can I modify or cancel a booking after confirmation?', 'The ability to modify or cancel a booking depends on the property owner\'s cancellation policy. Check the property listing and booking confirmation for details. Some modifications may incur charges.', 'tenant', '2023-12-11 11:56:58'),
(75, 'How can I report suspicious or fraudulent activity on Myrentwish?', 'If you come across any suspicious or fraudulent activity, report it immediately through the \"Report Listing\" option on the property page. Our team will investigate and take appropriate action.', 'tenant', '2023-12-11 11:57:39');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fcm`
--

CREATE TABLE `tbl_fcm` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `device_token` varchar(255) DEFAULT NULL,
  `device_status` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_fcm`
--

INSERT INTO `tbl_fcm` (`id`, `user_id`, `device_token`, `device_status`, `created_at`, `updated_at`) VALUES
(1, 8, 'f0CYFFO1Q7yM7-odkColEz:APA91bHefpuwb-YK0rUXOIxf0H_rQta6sEkNv1ja1XCnKw5MSTbbGw4vKOlWzB1samIyQuzpTtpLayfeIry6W3rNhKI20jwDnvrwN3dN57-OhvWvX7Nkoc_Bn5B1yQxwp7UZr-h-txjW', 'Android', '2023-12-06 07:23:51', '2023-12-06 07:23:51'),
(2, 12, 'vvv', 'Android', '0000-00-00 00:00:00', '2023-12-14 13:08:29');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_interest`
--

CREATE TABLE `tbl_interest` (
  `interest_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `prop_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_interest`
--

INSERT INTO `tbl_interest` (`interest_id`, `user_id`, `prop_id`) VALUES
(7, 12, 3);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_notifications`
--

CREATE TABLE `tbl_notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_notifications`
--

INSERT INTO `tbl_notifications` (`notification_id`, `user_id`, `owner_id`, `property_id`, `title`, `message`, `created_at`) VALUES
(4, 12, 8, 3, 'New Interest', 'User vishnu is interested in your property 2BHK', '2023-12-12 07:20:47');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_otp`
--

CREATE TABLE `tbl_otp` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp_code` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expire_at` timestamp NOT NULL DEFAULT (current_timestamp() + interval 10 minute)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_otp`
--

INSERT INTO `tbl_otp` (`id`, `email`, `otp_code`, `created_at`, `expire_at`) VALUES
(1, 'kilvishbirla@gmail.com', 282205, '2023-12-14 07:12:45', '2023-12-14 07:22:45'),
(2, 'admin@gmail.com', 723931, '2023-12-14 08:19:01', '2023-12-14 09:29:31');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pandp`
--

CREATE TABLE `tbl_pandp` (
  `id` int(11) NOT NULL,
  `policy` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_pandp`
--

INSERT INTO `tbl_pandp` (`id`, `policy`) VALUES
(1, '<p><strong>User Privacy Policy for Myrentwish 2023</strong></p>\r\n\r\n<p><strong>Last Updated: [Date]</strong></p>\r\n\r\n<p>Welcome to Myrentwish! This Privacy Policy describes how we collect, use, and share your personal information when you use our platform to rent or rent out properties.</p>\r\n\r\n<p><strong>1. Information We Collect:</strong></p>\r\n\r\n<p>We collect the following types of information when you use Myrentwish:</p>\r\n\r\n<ul>\r\n	<li>\r\n	<p><strong>User Information:</strong> When you create an account, we collect your name, email address, and other relevant information to provide our services.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Property Details:</strong> If you list a property, we collect information such as property details, location, rental terms, and other details necessary for property listings.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Payment Information:</strong> When making or receiving payments, we collect payment details to facilitate transactions securely.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Communication Data:</strong> We collect information from your communications with other users on the platform, including messages and interactions.</p>\r\n	</li>\r\n</ul>\r\n\r\n<p><strong>2. How We Use Your Information:</strong></p>\r\n\r\n<p>We use your information for the following purposes:</p>\r\n\r\n<ul>\r\n	<li>\r\n	<p><strong>Providing Services:</strong> To facilitate property rentals, including connecting users, processing transactions, and managing property listings.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Communication:</strong> To communicate with you regarding your account, property listings, and relevant updates.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Improving Services:</strong> To analyze user behavior and preferences, improve our services, and enhance user experience.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Legal Compliance:</strong> To comply with legal obligations, resolve disputes, and enforce our policies.</p>\r\n	</li>\r\n</ul>\r\n\r\n<p><strong>3. Information Sharing:</strong></p>\r\n\r\n<p>We may share your information with third parties under the following circumstances:</p>\r\n\r\n<ul>\r\n	<li>\r\n	<p><strong>With Other Users:</strong> Sharing necessary information with other users involved in a property transaction.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Service Providers:</strong> Engaging third-party service providers to assist with services like payment processing.</p>\r\n	</li>\r\n	<li>\r\n	<p><strong>Legal Compliance:</strong> Disclosing information as required by law or in response to legal requests.</p>\r\n	</li>\r\n</ul>\r\n\r\n<p><strong>4. Data Security:</strong></p>\r\n\r\n<p>We take measures to protect your information, but no data transmission over the internet is entirely secure. Please take steps to keep your account information secure.</p>\r\n\r\n<p><strong>5. Your Choices:</strong></p>\r\n\r\n<p>You can manage your account settings and preferences through the platform. If you wish to delete your account, please contact us.</p>\r\n\r\n<p><strong>6. Updates to this Privacy Policy:</strong></p>\r\n\r\n<p>We may update this Privacy Policy to reflect changes in our practices. Check the policy periodically for updates.</p>\r\n\r\n<p><strong>7. Contact Us:</strong></p>\r\n\r\n<p>If you have questions about this Privacy Policy or your privacy on Myrentwish, please contact us at [your contact information].</p>\r\n\r\n<p>Thank you for using Myrentwish!</p>\r\n');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_prefer`
--

CREATE TABLE `tbl_prefer` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `prefered_gender` varchar(255) NOT NULL,
  `prefered_city` varchar(255) NOT NULL,
  `prefered_country` varchar(255) NOT NULL,
  `bedroom_nums` varchar(255) NOT NULL,
  `bathroom_type` varchar(255) NOT NULL,
  `parking_type` varchar(255) NOT NULL,
  `prefered_rent` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_prop`
--

CREATE TABLE `tbl_prop` (
  `prop_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `owner_name` varchar(255) DEFAULT NULL,
  `owner_contact` varchar(20) DEFAULT NULL,
  `owner_email` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `prefered_gender` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `prop_type` varchar(50) DEFAULT NULL,
  `bedroom_nums` varchar(255) DEFAULT NULL,
  `bathroom_type` enum('Shared','Private') DEFAULT NULL,
  `parking_type` enum('Dedicated','Shared','Available','Not Available') DEFAULT NULL,
  `size_sqft` varchar(255) DEFAULT NULL,
  `rent_amount` varchar(255) DEFAULT NULL,
  `currency` varchar(3) DEFAULT 'CAD',
  `available_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_available` varchar(255) DEFAULT 'true',
  `prop_status` enum('available','rented') DEFAULT 'available',
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_prop`
--

INSERT INTO `tbl_prop` (`prop_id`, `user_id`, `owner_name`, `owner_contact`, `owner_email`, `title`, `prefered_gender`, `description`, `address`, `city`, `country`, `prop_type`, `bedroom_nums`, `bathroom_type`, `parking_type`, `size_sqft`, `rent_amount`, `currency`, `available_date`, `is_available`, `prop_status`, `images`, `created_at`, `updated_at`) VALUES
(1, 8, 'Kilvish', '9039568219', 'kilvishbirla@gmal.com', '2BHK', 'Women', 'very Stylish Moder Age 2BHK villa ', 'Sairam plaza ', 'Indore', 'India', 'Home', '2', 'Private', 'Dedicated', '2000.00', '200.00', 'CAD', '2023-11-30 18:30:00', 'true', 'available', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_aa.jpg_1701416919081.jpg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_image01.jpg_1701416919100.jpg\"}]', '2023-12-01 07:48:39', '2023-12-12 10:42:13'),
(3, 8, 'Kilvish', '9039568219', 'kilvishbirla@gmal.com', '2BHK', 'Women', 'very Stylish Moder Age 2BHK villa ', 'Sairam plaza ', 'Indore', 'India', 'Home', '2', 'Private', 'Dedicated', '2000.00', '200.00', 'CAD', '2023-11-30 18:30:00', 'false', 'rented', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_aa.jpg_1701417946319.jpg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_image01.jpg_1701417946336.jpg\"}]', '2023-12-01 08:05:46', '2023-12-12 10:42:13'),
(5, 12, 'Vishnu', '1234567890', 'vishnuprajapati1@gmail.com', '4BHK', 'Women', 'Very good 4BHK', 'Vijay Nagar', 'Bhopal', 'India', 'Villa', '2', 'Private', 'Dedicated', '1000', '1000', 'CAD', '2023-11-30 18:30:00', '1', 'available', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_female12.jpeg_1702548559794.jpeg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_female13.jpeg_1702548559795.jpeg\"}]', '2023-12-01 08:30:30', '2023-12-14 10:09:19'),
(6, 12, 'Vishnu', '1234567890', 'vishnuprajapati1@gmail.com', '4BHK', 'Women', 'Very good 4BHK', 'Vijay Nagar', 'Indore', 'India', 'Home', '2', 'Private', 'Dedicated', '2000.00', '200.00', 'CAD', '2023-11-30 18:30:00', 'true', 'available', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_female5.jpeg_1701432210023.jpeg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_female6.jpeg_1701432210024.jpeg\"}]', '2023-12-01 08:31:47', '2023-12-12 10:42:13'),
(7, 12, 'Vishnu', '1234567890', 'vishnuprajapati1@gmail.com', '3BHK', 'Women', 'very Stylish Moder Age 3BHK villa ', 'Vijay Nagar', 'Indore', 'India', 'Home', '2', 'Private', 'Dedicated', '2000', '200', 'CAD', '2023-11-30 18:30:00', 'true', 'available', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_1.jpg_1701502945996.jpg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_11.jpg_1701502946017.jpg\"}]', '2023-12-02 07:42:26', '2023-12-12 10:42:13'),
(12, 26, 'User26', '9039568219', 'user26@gmail.com', '3BHK', 'Women', 'Banglow', 'Vijay Nagar', 'Indore', 'India', 'Home', '2', 'Private', 'Dedicated', '2000', '200', 'CAD', '2023-11-30 18:30:00', '1', 'available', '[{\"path\":\"http://195.35.23.27:3008/uploads/img_472613970.jpg_1702368026543.jpg\"},{\"path\":\"http://195.35.23.27:3008/uploads/img_images.jpg_1702368026544.jpg\"}]', '2023-12-12 08:00:26', '2023-12-12 10:42:13');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_proptype`
--

CREATE TABLE `tbl_proptype` (
  `id` int(11) NOT NULL,
  `prop_type` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_proptype`
--

INSERT INTO `tbl_proptype` (`id`, `prop_type`, `created_at`) VALUES
(2, 'Home', '2023-12-05 12:17:12'),
(4, 'Room', '2023-12-06 06:21:59'),
(7, 'Villa', '2023-12-07 11:31:29');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_queries`
--

CREATE TABLE `tbl_queries` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` longtext NOT NULL,
  `complain_number` varchar(50) NOT NULL,
  `status` enum('opened','closed') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_queries`
--

INSERT INTO `tbl_queries` (`id`, `user_id`, `subject`, `email`, `message`, `complain_number`, `status`) VALUES
(8, '8', 'My Rent is due ', 'kilvishbirla@gmail.com', 'My prvious Tatent gave me half rent', '86218', 'opened');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_questions`
--

CREATE TABLE `tbl_questions` (
  `question_id` int(11) NOT NULL,
  `question_text` varchar(255) NOT NULL,
  `question_type` enum('options_2','options_3','dropdown') NOT NULL,
  `answer_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`answer_options`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_questions`
--

INSERT INTO `tbl_questions` (`question_id`, `question_text`, `question_type`, `answer_options`) VALUES
(1, 'what is your fvt color ?', 'options_2', '[\"yellow\",\"green\"]'),
(2, 'which is your fvt Game?', 'options_3', '[\"Cricket\",\"Football\",\"Hockey\"]'),
(3, 'which is your places ?', 'dropdown', '[\"Indore\",\"Bhopal\",\"Goa\",\"USA\",\"England\",\"Itly\",\"Mumbai\"]'),
(5, 'What is your Prefered Gender ? ', 'options_2', '[\"male\",\"female\"]'),
(6, 'With whom do you want to Live ? ', 'options_2', '[\"male \",\"female\"]'),
(7, 'jsdkfjsdf', 'options_2', '[\"sfd\",\"sdfd\"]'),
(8, 'sdfsdfsd', 'options_2', '[\"sfsdf\",\"sdfsdfsd\"]'),
(9, ' Quest 8', 'options_2', '[\"sfsd\",\"sfsdf\"]'),
(10, ' Quest 9 ', 'options_3', '[\"sfsdf\",\"sdfsdf\",\"sfdf\"]'),
(11, ' Quest 11', 'dropdown', '[\"sfd\",\"sfdsfsd\",\"ssdfsfd\",\"sfsfd\",\"sfsdf\"]'),
(12, ' Quest 13', 'options_2', '[\"sfsdf\",\"sdfsdf\"]'),
(13, ' Quest 14', 'options_2', '[\"ssd\",\"sfsdf\"]'),
(14, ' Quest 15', 'options_2', '[\"sfsdf\",\"ssdf\"]'),
(15, ' Quest 16', 'options_2', '[\"sdfds\",\"sfsdf\"]'),
(16, ' Quest 17', 'options_2', '[\"sdfsd\",\"ssfd\"]'),
(17, ' Quest 18', 'options_2', '[\"sdfsd\",\"sdfsdf\"]'),
(18, ' Quest 19', 'dropdown', '[\"sfsdf\",\"sdfsd\",\"sfsdf\",\"sfsdf\"]'),
(19, ' Quest 20', 'options_3', '[\"sdfds\",\"sfsd\",\"sfsd\"]'),
(20, ' Quest 21', 'options_2', '[\"sdfsdf\",\"sdfsdfds\"]'),
(21, 'Question 21 ', 'options_2', '[\"mahen\",\"netaji\"]');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_register`
--

CREATE TABLE `tbl_register` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `birthday` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_register`
--

INSERT INTO `tbl_register` (`user_id`, `name`, `email`, `birthday`, `password`) VALUES
(1, 'kilvish', 'kil@gmail.com', '25-03-1991', '123456');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_skills`
--

CREATE TABLE `tbl_skills` (
  `id` int(11) NOT NULL,
  `skill` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_skills`
--

INSERT INTO `tbl_skills` (`id`, `skill`, `created_at`) VALUES
(1, 'House work', '2023-12-07 12:29:29'),
(2, 'Education / Learning', '2023-12-07 13:06:25'),
(3, 'Physical Assistance', '2023-12-07 13:06:33'),
(4, 'Transportation', '2023-12-07 13:06:55'),
(5, 'Pet / Animal Care', '2023-12-07 13:06:58'),
(6, 'Elder cafe', '2023-12-07 13:07:09'),
(7, 'Cooking', '2023-12-07 13:07:18'),
(8, 'Child care', '2023-12-07 13:07:21'),
(12, 'Ground Work', '2023-12-11 11:37:50'),
(13, 'Championship', '2023-12-11 11:38:09');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_support`
--

CREATE TABLE `tbl_support` (
  `id` int(11) NOT NULL,
  `support_email` varchar(255) DEFAULT NULL,
  `support_contact` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_support`
--

INSERT INTO `tbl_support` (`id`, `support_email`, `support_contact`) VALUES
(1, 'support@myrentwish.com', '+39-123456789');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_tandc`
--

CREATE TABLE `tbl_tandc` (
  `id` int(11) NOT NULL,
  `terms` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_tandc`
--

INSERT INTO `tbl_tandc` (`id`, `terms`) VALUES
(1, '<p><strong>Terms and Conditions for Myrentwish</strong></p>\r\n\r\n<p><strong>Last Updated: [Date]</strong></p>\r\n\r\n<p>Welcome to Myrentwish! These Terms and Conditions (&quot;Terms&quot;) govern your use of the Myrentwish platform. By accessing or using our services, you agree to comply with these Terms.</p>\r\n\r\n<p><strong>1. User Eligibility:</strong></p>\r\n\r\n<p>You must be at least 18 years old and capable of forming a legally binding contract to use Myrentwish. By accessing or using our services, you confirm that you meet these eligibility requirements.</p>\r\n\r\n<p><strong>2. Account Registration:</strong></p>\r\n\r\n<p>To access certain features, you may need to create an account. Provide accurate and complete information during registration and keep your account information updated.</p>\r\n\r\n<p><strong>3. Property Listings:</strong></p>\r\n\r\n<p>If you list a property, you agree to provide accurate and up-to-date information about the property. Myrentwish reserves the right to remove any listing that violates these Terms or local laws.</p>\r\n\r\n<p><strong>4. User Conduct:</strong></p>\r\n\r\n<p>You agree not to engage in any activities that violate these Terms or applicable laws. This includes, but is not limited to, fraudulent activities, harassment, or any behavior that disrupts the normal functioning of the platform.</p>\r\n\r\n<p><strong>5. Payments:</strong></p>\r\n\r\n<p>For transactions conducted on the platform, you agree to abide by the payment terms outlined during the transaction process. Myrentwish may use third-party payment processors for secure transactions.</p>\r\n\r\n<p><strong>6. Privacy:</strong></p>\r\n\r\n<p>Your use of Myrentwish is subject to our Privacy Policy. By using our services, you consent to the collection, use, and sharing of your information as described in the Privacy Policy.</p>\r\n\r\n<p><strong>7. Intellectual Property:</strong></p>\r\n\r\n<p>Myrentwish retains ownership of all intellectual property associated with the platform. You may not use our trademarks, logos, or other proprietary materials without our written consent.</p>\r\n\r\n<p><strong>8. Termination:</strong></p>\r\n\r\n<p>Myrentwish reserves the right to suspend or terminate your account if you violate these Terms or engage in activities that could harm the platform or other users.</p>\r\n\r\n<p><strong>9. Disclaimer of Warranties:</strong></p>\r\n\r\n<p>Myrentwish provides services &quot;as is&quot; and makes no warranties or representations regarding the accuracy, completeness, or suitability of the information on the platform.</p>\r\n\r\n<p><strong>10. Limitation of Liability:</strong></p>\r\n\r\n<p>Myrentwish is not liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of the platform or any interactions with other users.</p>\r\n\r\n<p><strong>11. Changes to Terms:</strong></p>\r\n\r\n<p>Myrentwish may update these Terms from time to time. Continued use of the platform after the effective date of changes constitutes acceptance of the modified Terms.</p>\r\n\r\n<p><strong>12. Governing Law:</strong></p>\r\n\r\n<p>These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from or relating to these Terms will be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].</p>\r\n\r\n<p><strong>Contact Us:</strong></p>\r\n\r\n<p>If you have questions about these Terms, please contact us at [your contact information].</p>\r\n\r\n<p>Thank you for using Myrentwish!</p>\r\n\r\n<hr />\r\n<p>Replace <code>[Date]</code> and <code>[your contact information]</code> with the appropriate details. Customize the terms to suit the specific nature of your platform and comply with local regulations.</p>\r\n');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_mobile` varchar(15) DEFAULT NULL,
  `birthday` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT 'notDetected',
  `latitude` varchar(255) NOT NULL DEFAULT 'notDetected',
  `longitude` varchar(255) NOT NULL DEFAULT 'notDetected',
  `address` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `prefered_gender` varchar(255) NOT NULL,
  `prefered_city` varchar(255) NOT NULL,
  `prefered_country` varchar(255) NOT NULL,
  `bedroom_nums` varchar(255) NOT NULL,
  `bathroom_type` varchar(255) NOT NULL,
  `parking_type` varchar(255) NOT NULL,
  `prefered_type` varchar(255) NOT NULL,
  `prefered_rent` varchar(255) NOT NULL,
  `about_me` text NOT NULL,
  `skill` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `imagePath` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`user_id`, `firstname`, `lastname`, `user_email`, `password`, `user_mobile`, `birthday`, `location`, `latitude`, `longitude`, `address`, `country`, `city`, `gender`, `prefered_gender`, `prefered_city`, `prefered_country`, `bedroom_nums`, `bathroom_type`, `parking_type`, `prefered_type`, `prefered_rent`, `about_me`, `skill`, `image`, `imagePath`, `status`, `created_at`) VALUES
(8, 'Kilvish11', 'Birla', 'kilvishbirla@gmail.com', '$2a$10$jv.Gpm1HMKXAzcPOLhVnR.ns5q2/8re7lEimjfOGsFv9PHl.jxlP2', '9039568219', '25-03-1970', '', '', '', '           Sai ram plaza       ', 'India', 'Indore', 'Man', 'Women', 'newyork', 'USA', '1', 'Shared', 'Shared', 'Home', '200', 'i am andhera ', 'House Work', 'img_batman.jpg_1701259463709.jpg', 'http://195.35.23.27:3008/uploads/img_batman.jpg_1701259463709.jpg', 'active', '2023-11-29 07:39:02'),
(9, 'Vasu', 'Birla', 'vasubirla@gmail.com', '$2a$10$LIWBfxIho8ZodGzPqrfKC.a4mxqpz392NPsl5ETI/p8tJ6Zy/Kw7i', '9039568219', '25-03-1970', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'Man', 'Women', '', '', '', '', '', 'Home', '', '', '', ' ', ' ', 'inactive', '2023-11-29 12:21:41'),
(12, 'vishnu', 'prajapati', 'vishnuprajapati1@gmail.com', '$2a$10$u9O5qoBN/DfTFPRuOFsaOOqTxTG/Qzsxcpjpb/OQovJT8r/AFU00q', '1234567899', '24/06/2003', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'Man', 'Women', 'indore', 'India', '1', 'Shared', 'Shared', 'Home', '500', 'vishnu', '', 'img_scaled_Snapchat-181536531.jpg_1701342334363.jpg', 'http://195.35.23.27:3008/uploads/img_scaled_Snapchat-181536531.jpg_1701342334363.jpg', 'active', '2023-11-30 06:49:19'),
(16, 'vishnu', 'prajapati', 'vishnuprajapati2@gmail.com', '$2a$10$Xssq1UKg11c6Os.ZRj8XZ.nxoWz7IgBCDPoU0TZmLtkMU6q8jHEj6', '1234567899', '24/06/2003', '', '', '', '  Sairam ram plaza  ', 'India', 'Indore', 'Man', 'Women', '', '', '', '', '', 'Home', '', '', '', ' ', ' ', 'active', '2023-12-01 06:01:24'),
(17, 'vishnu', 'prajapati', 'vishnuprajapati3@gmail.com', '$2a$10$tKef6ypmAvLDshoKWLdaJ.H4ZoKMGNkqm7F8xB9VlA6iX2MHDCTMa', '1234567899', '24/06/2003', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'Man', 'Women', '', '', '', '', '', 'Home', '', '', '', ' ', ' ', 'active', '2023-12-01 10:41:31'),
(26, 'user26', ' ', 'user26@gmail.com', '$2a$10$ak4u8X.1ex4JEHp3CAxvp.XZHCSdRQZecnJq2EgJUw/GUUYy5S036', '9039568219', '24/06/2003', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'Man', 'female', 'newyork', 'Canada', '1', 'Shared', 'Shared', 'Home', '300', 'i am andhera ', 'House Work', '', '', 'active', '2023-12-07 07:51:06'),
(32, 'Marvel', 'Patel', 'marvel@gmail.com', '$2a$10$9HUeR4gdxsDwCYC4iADStu47MC10aAxyn8fc06VD12Ys2LPt3HSVm', '9039568219', '24/06/2003', '', '', '', 'Sairam ram plaza', 'India', 'Indore', 'Man', 'Women', '', '', '', '', '', '', '', ' ', ' ', '', '', 'active', '2023-12-14 06:09:48');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_answers`
--

CREATE TABLE `tbl_user_answers` (
  `answer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user_answers`
--

INSERT INTO `tbl_user_answers` (`answer_id`, `user_id`, `question_id`, `question`, `answer`, `created_at`, `updated_at`) VALUES
(1, 12, 1, 'what is your fvt color ?', 'yellow', '2023-12-07 07:40:06', '2023-12-15 05:13:49'),
(8, 12, 2, 'which is your fvt Game?', 'Cricket', '2023-12-08 10:13:51', '2023-12-15 05:13:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_apppass`
--
ALTER TABLE `tbl_apppass`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_customerprivacy`
--
ALTER TABLE `tbl_customerprivacy`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_faq`
--
ALTER TABLE `tbl_faq`
  ADD PRIMARY KEY (`faq_id`);

--
-- Indexes for table `tbl_fcm`
--
ALTER TABLE `tbl_fcm`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_interest`
--
ALTER TABLE `tbl_interest`
  ADD PRIMARY KEY (`interest_id`),
  ADD UNIQUE KEY `unique_user_prop` (`user_id`,`prop_id`);

--
-- Indexes for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  ADD PRIMARY KEY (`notification_id`);

--
-- Indexes for table `tbl_otp`
--
ALTER TABLE `tbl_otp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_pandp`
--
ALTER TABLE `tbl_pandp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_prefer`
--
ALTER TABLE `tbl_prefer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_prop`
--
ALTER TABLE `tbl_prop`
  ADD PRIMARY KEY (`prop_id`);

--
-- Indexes for table `tbl_proptype`
--
ALTER TABLE `tbl_proptype`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_queries`
--
ALTER TABLE `tbl_queries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_questions`
--
ALTER TABLE `tbl_questions`
  ADD PRIMARY KEY (`question_id`);

--
-- Indexes for table `tbl_register`
--
ALTER TABLE `tbl_register`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tbl_skills`
--
ALTER TABLE `tbl_skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_support`
--
ALTER TABLE `tbl_support`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_tandc`
--
ALTER TABLE `tbl_tandc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `tbl_user_answers`
--
ALTER TABLE `tbl_user_answers`
  ADD PRIMARY KEY (`answer_id`),
  ADD UNIQUE KEY `unique_user_question` (`user_id`,`question_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_apppass`
--
ALTER TABLE `tbl_apppass`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_customerprivacy`
--
ALTER TABLE `tbl_customerprivacy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_faq`
--
ALTER TABLE `tbl_faq`
  MODIFY `faq_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `tbl_fcm`
--
ALTER TABLE `tbl_fcm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_interest`
--
ALTER TABLE `tbl_interest`
  MODIFY `interest_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_otp`
--
ALTER TABLE `tbl_otp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_pandp`
--
ALTER TABLE `tbl_pandp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_prefer`
--
ALTER TABLE `tbl_prefer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_prop`
--
ALTER TABLE `tbl_prop`
  MODIFY `prop_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tbl_proptype`
--
ALTER TABLE `tbl_proptype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_queries`
--
ALTER TABLE `tbl_queries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_questions`
--
ALTER TABLE `tbl_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `tbl_register`
--
ALTER TABLE `tbl_register`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_skills`
--
ALTER TABLE `tbl_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbl_tandc`
--
ALTER TABLE `tbl_tandc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `tbl_user_answers`
--
ALTER TABLE `tbl_user_answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
