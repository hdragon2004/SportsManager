// Example Flutter implementation for socket.io client
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

// Socket.io event types (should match with backend)
class SocketEvents {
  static const String connect = 'connect';
  static const String disconnect = 'disconnect';
  static const String joinTournament = 'joinTournament';
  static const String leaveTournament = 'leaveTournament';
  
  static const String newSchedule = 'newSchedule';
  static const String matchResultUpdated = 'matchResultUpdated';
  static const String registrationStatus = 'registrationStatus';
  
  static const String notificationReceived = 'notificationReceived';
}

// Notification model
class NotificationModel {
  final int id;
  final String title;
  final String message;
  final String type;
  final int userId;
  final int? matchId;
  final int? tournamentId;
  final DateTime timeSent;
  bool isRead;

  NotificationModel({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.userId,
    this.matchId,
    this.tournamentId,
    required this.timeSent,
    this.isRead = false,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'],
      title: json['title'],
      message: json['message'],
      type: json['type'],
      userId: json['User_ID'],
      matchId: json['Match_ID'],
      tournamentId: json['Tournament_ID'],
      timeSent: DateTime.parse(json['time_sent']),
      isRead: json['is_read'] ?? false,
    );
  }
}

// Socket provider to manage socket connection and notifications
class SocketProvider with ChangeNotifier {
  IO.Socket? _socket;
  List<NotificationModel> _notifications = [];
  int _unreadCount = 0;
  final String _baseUrl = 'http://10.0.2.2:3000'; // Use your server URL
  final FlutterLocalNotificationsPlugin _flutterLocalNotificationsPlugin = 
      FlutterLocalNotificationsPlugin();

  // Getters
  IO.Socket? get socket => _socket;
  List<NotificationModel> get notifications => _notifications;
  int get unreadCount => _unreadCount;

  // Initialize socket connection
  void initSocket(int userId) {
    // Initialize local notifications
    _initLocalNotifications();
    
    // Create socket connection
    _socket = IO.io(_baseUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
      'reconnection': true,
      'reconnectionDelay': 1000,
      'reconnectionAttempts': 5
    });

    // Set up event listeners
    _socket!.on(SocketEvents.connect, (_) {
      print('Connected to socket server');
      
      // Authenticate with user ID
      _socket!.emit('authenticate', userId);
    });

    _socket!.on(SocketEvents.disconnect, (_) {
      print('Disconnected from socket server');
    });

    // Listen for new schedule notifications
    _socket!.on(SocketEvents.newSchedule, (data) {
      print('New schedule notification received: $data');
      
      final notification = NotificationModel.fromJson(data['notification']);
      _addNotification(notification);
      
      // Show local notification
      _showLocalNotification(notification.title, notification.message);
      
      // Acknowledge receipt
      _socket!.emit(SocketEvents.notificationReceived, notification.id);
    });

    // Listen for match result updates
    _socket!.on(SocketEvents.matchResultUpdated, (data) {
      print('Match result notification received: $data');
      
      final notification = NotificationModel.fromJson(data['notification']);
      _addNotification(notification);
      
      // Show local notification
      _showLocalNotification(notification.title, notification.message);
      
      // Acknowledge receipt
      _socket!.emit(SocketEvents.notificationReceived, notification.id);
    });

    // Listen for registration status updates
    _socket!.on(SocketEvents.registrationStatus, (data) {
      print('Registration status notification received: $data');
      
      final notification = NotificationModel.fromJson(data['notification']);
      _addNotification(notification);
      
      // Show local notification
      _showLocalNotification(notification.title, notification.message);
      
      // Acknowledge receipt
      _socket!.emit(SocketEvents.notificationReceived, notification.id);
    });

    // Connect to socket server
    _socket!.connect();
    
    // Load initial notifications
    fetchUserNotifications(userId);
  }

  // Initialize local notifications
  Future<void> _initLocalNotifications() async {
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    
    const InitializationSettings initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
    );
    
    await _flutterLocalNotificationsPlugin.initialize(
      initializationSettings,
    );
  }

  // Show local notification
  Future<void> _showLocalNotification(String title, String body) async {
    const AndroidNotificationDetails androidPlatformChannelSpecifics =
        AndroidNotificationDetails(
      'sports_tournament_channel',
      'Sports Tournament Notifications',
      channelDescription: 'Notifications for sports tournament events',
      importance: Importance.max,
      priority: Priority.high,
    );
    
    const NotificationDetails platformChannelSpecifics =
        NotificationDetails(android: androidPlatformChannelSpecifics);
    
    await _flutterLocalNotificationsPlugin.show(
      0,
      title,
      body,
      platformChannelSpecifics,
    );
  }

  // Add notification to the list
  void _addNotification(NotificationModel notification) {
    _notifications.insert(0, notification);
    if (!notification.isRead) {
      _unreadCount++;
    }
    notifyListeners();
  }

  // Join tournament room
  void joinTournament(int tournamentId) {
    if (_socket != null && _socket!.connected) {
      _socket!.emit(SocketEvents.joinTournament, tournamentId);
      print('Joined tournament room: $tournamentId');
    }
  }

  // Leave tournament room
  void leaveTournament(int tournamentId) {
    if (_socket != null && _socket!.connected) {
      _socket!.emit(SocketEvents.leaveTournament, tournamentId);
      print('Left tournament room: $tournamentId');
    }
  }

  // Fetch user notifications from API
  Future<void> fetchUserNotifications(int userId) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/api/users/$userId/notifications'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success']) {
          _notifications = (data['data'] as List)
              .map((item) => NotificationModel.fromJson(item))
              .toList();
          
          // Get unread count
          final countResponse = await http.get(
            Uri.parse('$_baseUrl/api/users/$userId/notifications/unread-count'),
            headers: {'Content-Type': 'application/json'},
          );
          
          if (countResponse.statusCode == 200) {
            final countData = jsonDecode(countResponse.body);
            if (countData['success']) {
              _unreadCount = countData['data']['count'];
            }
          }
          
          notifyListeners();
        }
      }
    } catch (error) {
      print('Error fetching notifications: $error');
    }
  }

  // Mark notification as read
  Future<void> markAsRead(int notificationId) async {
    try {
      final response = await http.put(
        Uri.parse('$_baseUrl/api/notifications/$notificationId/read'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        // Update local state
        final index = _notifications.indexWhere((n) => n.id == notificationId);
        if (index != -1 && !_notifications[index].isRead) {
          _notifications[index].isRead = true;
          _unreadCount = _unreadCount > 0 ? _unreadCount - 1 : 0;
          notifyListeners();
        }
      }
    } catch (error) {
      print('Error marking notification as read: $error');
    }
  }

  // Mark all notifications as read
  Future<void> markAllAsRead(int userId) async {
    try {
      final response = await http.put(
        Uri.parse('$_baseUrl/api/users/$userId/notifications/read-all'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        // Update local state
        for (var notification in _notifications) {
          notification.isRead = true;
        }
        _unreadCount = 0;
        notifyListeners();
      }
    } catch (error) {
      print('Error marking all notifications as read: $error');
    }
  }

  // Dispose socket connection
  void dispose() {
    if (_socket != null) {
      _socket!.disconnect();
      _socket!.dispose();
    }
    super.dispose();
  }
}

// Example usage in main.dart
/*
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => SocketProvider(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sports Tournament App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: LoginScreen(),
    );
  }
}
*/

// Example NotificationScreen widget
class NotificationScreen extends StatefulWidget {
  final int userId;

  const NotificationScreen({Key? key, required this.userId}) : super(key: key);

  @override
  _NotificationScreenState createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  @override
  void initState() {
    super.initState();
    // Refresh notifications when screen opens
    Future.microtask(() => 
      Provider.of<SocketProvider>(context, listen: false)
        .fetchUserNotifications(widget.userId)
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          Consumer<SocketProvider>(
            builder: (context, provider, child) {
              if (provider.unreadCount > 0) {
                return IconButton(
                  icon: const Icon(Icons.done_all),
                  onPressed: () => provider.markAllAsRead(widget.userId),
                  tooltip: 'Mark all as read',
                );
              }
              return const SizedBox.shrink();
            },
          ),
        ],
      ),
      body: Consumer<SocketProvider>(
        builder: (context, provider, child) {
          if (provider.notifications.isEmpty) {
            return const Center(
              child: Text('No notifications'),
            );
          }
          
          return ListView.builder(
            itemCount: provider.notifications.length,
            itemBuilder: (context, index) {
              final notification = provider.notifications[index];
              return ListTile(
                title: Text(notification.title),
                subtitle: Text(notification.message),
                trailing: Text(
                  '${notification.timeSent.day}/${notification.timeSent.month}/${notification.timeSent.year}',
                ),
                leading: Icon(
                  _getNotificationIcon(notification.type),
                  color: notification.isRead ? Colors.grey : Colors.blue,
                ),
                tileColor: notification.isRead ? null : Colors.blue.withOpacity(0.1),
                onTap: () => provider.markAsRead(notification.id),
              );
            },
          );
        },
      ),
    );
  }
  
  IconData _getNotificationIcon(String type) {
    switch (type) {
      case 'NEW_SCHEDULE':
        return Icons.event;
      case 'MATCH_RESULT':
        return Icons.sports_score;
      case 'REGISTRATION_STATUS':
        return Icons.how_to_reg;
      default:
        return Icons.notifications;
    }
  }
}

// Example TournamentDetailScreen that joins a tournament room
class TournamentDetailScreen extends StatefulWidget {
  final int tournamentId;
  final String tournamentName;

  const TournamentDetailScreen({
    Key? key, 
    required this.tournamentId, 
    required this.tournamentName
  }) : super(key: key);

  @override
  _TournamentDetailScreenState createState() => _TournamentDetailScreenState();
}

class _TournamentDetailScreenState extends State<TournamentDetailScreen> {
  @override
  void initState() {
    super.initState();
    // Join tournament room when screen opens
    Provider.of<SocketProvider>(context, listen: false)
      .joinTournament(widget.tournamentId);
  }
  
  @override
  void dispose() {
    // Leave tournament room when screen closes
    Provider.of<SocketProvider>(context, listen: false)
      .leaveTournament(widget.tournamentId);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.tournamentName),
      ),
      body: Center(
        child: Text('Tournament details for ID: ${widget.tournamentId}'),
      ),
    );
  }
} 