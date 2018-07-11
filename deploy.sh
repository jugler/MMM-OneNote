#Send Magic Mirror config to pimirror
echo "Uploading config.js to MagicMirror"
scp config.js pi@pi:MagicMirror/config/config.js

echo "Updating module MMM-OneNote"
scp MMM-OneNote.js pi@pi:MagicMirror/modules/MMM-OneNote/MMM-OneNote.js
scp node_helper.js pi@pi:MagicMirror/modules/MMM-OneNote/node_helper.js
scp MMM-OneNote.css pi@pi:MagicMirror/modules/MMM-OneNote/MMM-OneNote.css

echo "Restarting MagicMirror"
ssh pi@pi 'pm2 restart mm'
echo "Done Uploading and restarting magic mirror"