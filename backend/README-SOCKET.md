# Real-time Notification System for Sports Tournament Management

This document describes how to use the real-time notification system implemented with Socket.io for the Sports Tournament Management application.

## Overview

The system provides real-time notifications for:
- New match schedules
- Match result updates
- Registration status updates (approval/rejection)

The implementation uses Socket.io for real-time communication between the server and clients.

## Server-side Implementation

### Socket.io Server Setup

The Socket.io server is initialized in `server.js` and managed through the `socketManager.js` file in the `socket` directory.

### Socket Events

| Event Name | Description | Payload |
|------------|-------------|---------|
| `newSchedule` | Sent when a new match is scheduled | `{ notification, matchData }` |
| `matchResultUpdated` | Sent when a match result is updated | `{ notification, matchData }` |
| `registrationStatus` | Sent when a team registration status changes | `{ notification, registrationData }` |
| `joinTournament` | Client joins a tournament room | `tournamentId` |
| `leaveTournament` | Client leaves a tournament room | `tournamentId` |
| `authenticate` | Client authenticates with user ID | `userId` |
| `notificationReceived` | Client acknowledges notification receipt | `notificationId` |

### Room-based Communication

The system uses Socket.io rooms to organize users by tournament:
- Users join tournament-specific rooms (`tournament_[id]`)
- Tournament-wide notifications are sent to all users in a room
- User-specific notifications are sent directly to the user's socket

## Client-side Implementation

### React Implementation

A React implementation is provided in `examples/socketClientReact.js`. Key features:
- Socket.io context provider for app-wide socket access
- Automatic connection and authentication
- Event listeners for all notification types
- Tournament room joining/leaving
- Notification display and management
- Browser notifications support

### Flutter Implementation

A Flutter implementation is provided in `examples/socketClientFlutter.dart`. Key features:
- SocketProvider class with ChangeNotifier for state management
- Automatic connection and authentication
- Event listeners for all notification types
- Tournament room joining/leaving
- Notification display and management
- Local notifications support

## Integration Guide

### Server-side Integration

1. The socket manager is already initialized in `server.js`
2. Controllers have been updated to send notifications:
   - `matchController.js` - Sends notifications for new schedules and match results
   - `registrationController.js` - Sends notifications for registration status updates

### Client-side Integration (React)

1. Install required packages:
   ```bash
   npm install socket.io-client axios
   ```

2. Wrap your app with the SocketProvider:
   ```jsx
   import { SocketProvider } from './path/to/socketClientReact';

   function App() {
     return (
       <SocketProvider userId={currentUserId}>
         <YourAppComponents />
       </SocketProvider>
     );
   }
   ```

3. Use the socket context in your components:
   ```jsx
   import { useSocket } from './path/to/socketClientReact';

   function YourComponent() {
     const { notifications, unreadCount, markAsRead } = useSocket();
     
     // Use socket functions and state
     return (
       <div>
         <p>You have {unreadCount} unread notifications</p>
         {/* Render notifications */}
       </div>
     );
   }
   ```

4. For tournament-specific pages, use the TournamentView component or join/leave rooms manually:
   ```jsx
   import { useSocket } from './path/to/socketClientReact';
   
   function TournamentPage({ tournamentId }) {
     const { joinTournament, leaveTournament } = useSocket();
     
     useEffect(() => {
       joinTournament(tournamentId);
       return () => leaveTournament(tournamentId);
     }, [tournamentId]);
     
     // Rest of your component
   }
   ```

### Client-side Integration (Flutter)

1. Add dependencies to `pubspec.yaml`:
   ```yaml
   dependencies:
     socket_io_client: ^2.0.0
     provider: ^6.0.0
     http: ^0.13.4
     flutter_local_notifications: ^9.0.0
   ```

2. Set up the SocketProvider at the app level:
   ```dart
   void main() {
     runApp(
       ChangeNotifierProvider(
         create: (context) => SocketProvider(),
         child: MyApp(),
       ),
     );
   }
   ```

3. Initialize the socket connection after user login:
   ```dart
   // After successful login
   final socketProvider = Provider.of<SocketProvider>(context, listen: false);
   socketProvider.initSocket(userId);
   ```

4. Use the provider in your widgets:
   ```dart
   Consumer<SocketProvider>(
     builder: (context, provider, child) {
       return Badge(
         label: Text('${provider.unreadCount}'),
         child: IconButton(
           icon: Icon(Icons.notifications),
           onPressed: () => Navigator.push(
             context,
             MaterialPageRoute(
               builder: (_) => NotificationScreen(userId: userId),
             ),
           ),
         ),
       );
     },
   )
   ```

5. For tournament-specific screens, join/leave rooms:
   ```dart
   @override
   void initState() {
     super.initState();
     Provider.of<SocketProvider>(context, listen: false)
       .joinTournament(widget.tournamentId);
   }
   
   @override
   void dispose() {
     Provider.of<SocketProvider>(context, listen: false)
       .leaveTournament(widget.tournamentId);
     super.dispose();
   }
   ```

## Testing

To test the real-time notification system:

1. Start the server:
   ```bash
   npm run dev
   ```

2. Use API endpoints to trigger notifications:
   - Create a new match (`POST /api/matches`)
   - Update a match with results (`PUT /api/matches/:id`)
   - Update a registration status (`PUT /api/registrations/:id`)

3. Observe the notifications in your client application

## Troubleshooting

Common issues and solutions:

- **Client not receiving notifications**: Check that the client has joined the correct room and is properly authenticated
- **Socket connection errors**: Verify CORS settings in `socketManager.js` match your client domain
- **Notification not appearing in database**: Check that the notification creation service is working correctly

## API Reference

### Notification REST Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications` | GET | Get all notifications |
| `/api/notifications/:id` | GET | Get a specific notification |
| `/api/notifications` | POST | Create a new notification |
| `/api/notifications/:id` | PUT | Update a notification |
| `/api/notifications/:id` | DELETE | Delete a notification |
| `/api/users/:userId/notifications` | GET | Get all notifications for a user |
| `/api/users/:userId/notifications/unread-count` | GET | Get unread notification count for a user |
| `/api/notifications/:id/read` | PUT | Mark a notification as read |
| `/api/users/:userId/notifications/read-all` | PUT | Mark all notifications as read for a user | 