# TODO: include aboslute path

# updating the text file of urls 
python3 youtubeTrending.py

# launch tshark in the background detecting quic traffic and storing it in packets.pcap
sudo tshark -i eno4 -f "udp port 443 or udp port 80" -w /packets.pcap &

# start obtaining screenshots
node parallel.js

# kill the first tshark 
pidSudo=`ps -ef | grep "sudo tshark" | grep -v grep | awk '{print $2}'`
sudo kill -9 $pidSudo

# kill the second tshark 
pidTshark=`ps -ef | grep tshark | grep -v grep | awk '{print $2}'`
sudo kill -9 $pidTshark