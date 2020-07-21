sudo tshark -i any -f "udp port 443 or udp port 80" -w /packets.pcap &

node youtube/parallel.js

fg 1
kill %1