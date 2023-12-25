-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 25, 2023 at 02:55 PM
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
-- Table structure for table `tbl_addagreement`
--

CREATE TABLE `tbl_addagreement` (
  `id` int(11) NOT NULL,
  `agreementContent` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_addagreement`
--

INSERT INTO `tbl_addagreement` (`id`, `agreementContent`) VALUES
(10, '<p><strong>RESIDENTIAL LEASE AGREEMENT</strong></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<ol>\r\n	<li><strong>PARTIES. </strong>This Residential Lease Agreement (&ldquo;Agreement&rdquo;) made on<a name=\"Text1\"></a>[TODAY&#39;S DATE]is between:</li>\r\n</ol>\r\n\r\n<p>Landlord Name: <a name=\"Text2\"></a>[LANDLORD&#39;S NAME]with a mailing address of:</p>\r\n\r\n<p>[LANDLORD&#39;S ADDRESS](&ldquo;Landlord&rdquo;), AND</p>\r\n\r\n<p>Tenant Name(s): [TENANT NAME(S)](&ldquo;Tenant(s)&rdquo;).</p>\r\n\r\n<p>Landlord and Tenant are each collectively referred to as the &quot;Parties.&quot;</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<ol>\r\n	<li><strong>PROPERTY.</strong>The Landlord agrees to lease the described property to the Tenant:</li>\r\n</ol>\r\n\r\n<p>Address: <a name=\"Text3\"></a>[PROPERTY ADDRESS](&ldquo;Premises&rdquo;).</p>\r\n\r\n<p>Residence Type: ☐ Single-family ☐ Apartment ☐ Condominium ☐ Other: [OTHER]</p>\r\n\r\n<ol>\r\n	<li><strong>TERM.</strong></li>\r\n</ol>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>The Agreement shall begin on [START DATE]and end on [END DATE] (&ldquo;Term&rdquo;).</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<ol>\r\n	<li><strong>RENT.</strong></li>\r\n</ol>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>The Tenant shall pay the Landlord in equal monthly installments of $<a name=\"Text5\"></a>[RENT] (&ldquo;Rent&rdquo;). The Rent shall be due on the [#]of every month (&ldquo;Due Date&rdquo;) and paid under the following instructions: [RENT PAYMENT INSTRUCTIONS].</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<ol>\r\n	<li><strong>SECURITY DEPOSIT.</strong> The Tenant (check one):</li>\r\n</ol>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<ul>\r\n	<li>Shall deposit with the Landlord the sum of $[SECURITY DEPOSIT]as security for any damage caused to the Premises during the Term. Such deposit shall be returned to the Tenant, less any itemized deductions, within [#]days after the end of the Term.</li>\r\n</ul>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<ul>\r\n	<li>Shall NOT be required to pay a security deposit.</li>\r\n</ul>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<ol>\r\n	<li><strong>SIGNATURES.</strong></li>\r\n</ol>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><strong>Landlord&rsquo;s Signature: </strong><a href=\"https://esign.com/\"><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </strong></a><strong>Date: </strong>[MM / DD / YYYY]</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>Printed Name: [PRINTED NAME]</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><strong>Tenant Signature: </strong><a href=\"https://esign.com/\"><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </strong></a><strong>Date: </strong>[MM / DD / YYYY]</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>Printed Name: [PRINTED NAME]</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><strong>Tenant Signature: </strong><a href=\"https://esign.com/\"><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </strong></a><strong>Date: </strong>[MM / DD / YYYY]</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>Printed Name: [PRINTED NAME]</p>\r\n');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_addagreement`
--
ALTER TABLE `tbl_addagreement`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_addagreement`
--
ALTER TABLE `tbl_addagreement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
