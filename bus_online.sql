-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 08, 2020 at 04:25 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bus_online`
--
CREATE DATABASE IF NOT EXISTS `bus_online` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bus_online`;
-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `bookingid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `routeid` int(11) NOT NULL,
  `payment` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`bookingid`, `userid`, `routeid`, `payment`, `status`) VALUES
(2, 2, 2, 50, 0),
(4, 2, 2, 50, 1),
(7, 2, 2, 50, 0),
(8, 3, 78, 20, 1),
(14, 3, 508, 36, 0);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `msgid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phoneno` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`msgid`, `name`, `email`, `phoneno`, `message`) VALUES
(1, 'Mummar Gaddafi', 'gaddafi@libya.com', '0000000000', 'ZENGA ZENGA DAR DAR'),
(2, 'Pewdiepie', 'pewdiepie@youtube.com', '1111111111', 'FLOOR GANG'),
(4, 'Francis Underwood', 'president@whitehouse.com', '1234567890', 'The presidency is mine! **knock on wood**'),
(5, 'omen', 'omen@bind.valorant.com', '000000000', 'I am not just a shadow!'),
(6, 'Abdullah', 'A@A.com', '0177896523', 'El Classico');

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `routeid` int(11) NOT NULL,
  `cost` int(11) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `date` varchar(255) NOT NULL,
  `origin` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `available_seats_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `routes`
--

INSERT INTO `routes` (`routeid`, `cost`, `time`, `date`, `origin`, `destination`, `available_seats_count`) VALUES
(2, 50, '12:00', '12/12/2004', 'bar', 'foo', 48),
(78, 20, '15:00', '19/07/2020', 'Johor Bahru', 'Sabah', 47),
(200, 20, '15:00', '07/10/2020', 'Johor Bahru', 'Kuala Lampur', 48),
(501, 20, '03:00', '19/07/2020', 'Johor Bahru', 'Sabah', 47),
(502, 43, '05:40', '19/07/2020', 'Johor Bahru', 'Sabah', 47),
(503, 13, '05:14', '19/07/2020', 'Johor Bahru', 'Sabah', 47),
(504, 54, '22:10', '19/07/2020', 'Johor Bahru', 'Sabah', 47),
(505, 41, '22:10', '19/07/2020', 'Johor Bahru', 'Sabah', 47),
(506, 35, '15:00', '07/10/2020', 'Johor Bahru', 'Kuala Lampur', 48),
(507, 23, '14:20', '07/10/2020', 'Johor Bahru', 'Kuala Lampur', 48),
(508, 36, '20:09', '07/10/2020', 'Johor Bahru', 'Kuala Lampur', 47);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phonenumber` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userid`, `name`, `phonenumber`, `email`, `username`, `level`, `password`) VALUES
(1, 'adam bro', '1234567890', 'adam@bus.com', 'admin', 1, 'admin'),
(2, 'noob csgotoohard', '987654321', 'valisgood@bus.com', 'user', 2, 'user'),
(3, 'saeed hashem', '1111111111', 'saeed@bus.com', 'saeed', 2, 'secret'),
(6, 'test', '11111111', 'test@bus.com', 'test', 2, 'test');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`bookingid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `routeid` (`routeid`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`msgid`);

--
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`routeid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `bookingid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `msgid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `routes`
--
ALTER TABLE `routes`
  MODIFY `routeid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=509;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`routeid`) REFERENCES `routes` (`routeid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
