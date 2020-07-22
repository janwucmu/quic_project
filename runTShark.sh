# TODO: include aboslute path
sudo tshark -i eno4 -f "udp port 443 or udp port 80" -w /packets.pcap &

node parallel.js

pidSudo=`ps -ef | grep "sudo tshark" | grep -v grep | awk '{print $2}'`
sudo kill -9 $pidSudo

pidTshark=`ps -ef | grep tshark | grep -v grep | awk '{print $2}'`
sudo kill -9 $pidTshark