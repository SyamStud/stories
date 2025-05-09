async function requestNotificationPermission() {
    // Ask permission to user
    const result = await Notification.requestPermission();

    if (result === 'denied') {
        console.log('Izin notification ditolak.');
        return;
    }

    if (result === 'default') {
        console.log('Izin notification ditutup atau diabaikan.');
        return;
    }

    console.log('Izin notification diterima');
};