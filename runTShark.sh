# TODO: include aboslute path

traffic="quic"

# updating the text file of urls 
python3 youtubeTrending.py

if [ $1 == "tcp" ];
then
    echo "Capturing TCP"
    # launch tshark in the background detecting tcp traffic and storing it in packetsTCP.pcap
    sudo tshark -i eno4 -f "tcp" -w /packetsTCP.pcap &
else
    echo "Capturing QUIC"
    # launch tshark in the background detecting quic traffic and storing it in packetsQuic.pcap
    sudo tshark -i eno4 -f "udp port 443 or udp port 80" -w /packetsQuic.pcap &
fi

# start obtaining screenshots
node parallel.js

# kill the first tshark process
pidSudo=`ps -ef | grep "sudo tshark" | grep -v grep | awk '{print $2}'`
sudo kill -9 $pidSudo

# kill the second tshark process
pidTshark=`ps -ef | grep tshark | grep -v grep | awk '{print $2}'`
sudo kill -9 $pidTshark
