
sudo tshark -i any -f "udp port 443 or udp port 80" &

node parallel.js

# pid=$!
# kill -9 $pid

kill $(ps -e | grep 'tshark' | awk '{print $1}')