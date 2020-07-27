# TODO: include aboslute path
# run parallel: bash runTShark.sh quic parallel, bash runTShark.sh tcp parallel
# run series: bash runTShark.sh quic series, bash runTShark.sh tcp series

# updating the text file of urls 
python3 youtubeTrending.py

com=""
packets=""
p_s=""
path=""
pcap=".pcap"

if [ $1 == "tcp" ];
then
    echo "Capturing TCP"
    packets="/tcp_"
    com="tcp"
else
    echo "Capturing QUIC"
    packets="/quic_"
    com="udp port 443 or udp port 80"
fi

if [ $2 == "series" ];
then
    echo "Running Series"
    p_s="series"
else
    echo "Running Parallel"
    p_s="parallel"
fi

file="${packets}${p_s}${pcap}"

# launch tshark in the background detecting traffic and storing it in a pcap file
sudo tshark -i eno4 -f "$com" -w "$file" &

# start obtaining screenshots
node parallel.js $p_s

# kill the first tshark process
pidSudo=`ps -ef | grep "sudo tshark" | grep -v grep | awk '{print $2}'`
sudo kill -9 $pidSudo

# kill the second tshark process
pidTshark=`ps -ef | grep tshark | grep -v grep | awk '{print $2}'`
sudo kill -9 $pidTshark