from scapy.all import *
import pandas as pd

special_char = {}
fields = {"header.form": [], "fixed.bit": [], "spin.bit": [], \
        "reserved": [], "key.bit": [], "packet.len": []}
#TODO need "dest.connect.id"

def df_to_csv():
    df = pd.read_csv("pcapCSV/quic_parallel.csv")
    for key, value in fields.items():
        df[key] = value
    df.to_csv("pkts_header/quic_fields.csv", index=False, sep="\t")


def chars_to_hex(lst, chars):
    special = False

    # convert chars to hex
    for i in range(len(chars)):
        if chars[i] != "\\":
            if (i != 0) and (chars[i-1:i+1] in special_char.keys()):
                lst.append(special_char[chars[i-1:i+1]])
                special = False
                continue
            if special:
                lst.append(hex(ord("\\"))[2:])
            lst.append(hex(ord(chars[i]))[2:])
            special = False
        else:
            if special:
                lst.append(hex(ord("\\"))[2:])
                special = False
            else:
                special = True
    return lst

def get_ip_src_dest(ip):
    src_hex = ip[12:16]
    dest_hex = ip[16:]
    src = ""
    dest = ""
    for i in range(len(src_hex)):
        # turn hex into decimal and cast as string
        src += str(int(src_hex[i], 16)) + "."
        dest += str(int(dest_hex[i], 16)) + "."
    # exclude the last "."
    src = src[:-1]
    dest = dest[:-1]

    # store it in fields dictionary
    fields["ip.src"].append(src)
    fields["ip.dest"].append(dest)

def get_udp_src_dest(udp):
    src_hex = udp[:2]
    dest_hex = udp[2:4]
    len_hex = udp[4:6]
    src = str(int(src_hex[0] + src_hex[1], 16))
    dest = str(int(dest_hex[0] + dest_hex[1], 16))
    length = str(int(len_hex[0] + len_hex[1], 16))

    # store it in fields dictionary
    fields["udp.srcport"].append(src)
    fields["udp.destport"].append(dest)
    fields["udp.len"].append(length)

def get_quic_info(quic):
    # turn hex into binary
    first_byte = str("{0:08b}".format(int(quic[0], 16)))

    # set each corresponding field based on first byte
    fields["header.form"].append(first_byte[0])
    fields["fixed.bit"].append(first_byte[1])
    fields["spin.bit"].append(first_byte[2])
    # convert binary to decimal
    fields["reserved"].append(int(first_byte[3:5], 2))
    fields["key.bit"].append(first_byte[5])
    # convert binary to decimal
    fields["packet.len"].append(int(first_byte[6:8], 2))

    #TODO need to do dest.connet.id

def main():
    # read pcap file
    pkts = rdpcap("pcapFiles/quic_parallel.pcap")

    # entire hex for the pkt
    pkts_hex = {}

    for i in range(3): #TODO change to len of pkts
        byte_hex = hexlify(bytes(pkts[i]))
        string = str(byte_hex, 'utf-8')
        lst = []
        for j in range(0, len(string), 2):
            lst.append(string[j:j+2])
        pkts_hex[0] = lst



    # open text file for hex and ascii
    f = open("pkts_header/hexdump.txt", 'w+')

    # put hex and ascii into text file
    for i in range(len(pkts)): #TODO change to len of pkts
        f.write(str(pkts[i]))
        f.write("\n")
    
    # file pointer to the beginning of the file
    f.seek(0)

    count = 0

    # entire hex for the pkt
    pkts_hex = {}

    # read each line of the file
    line = f.readline()
    while line != "":
        # parse the hex string
        lst = line.split("\\x")
        # exclude the first one b'
        lst = lst[1:]
        # create a new key for each packet
        pkts_hex[count] = lst

        count += 1
        line = f.readline()
    f.close()

    # build dictionary of special chars and its ascii in hex
    special = ["\'", "\"", "\n", "\r", "\t"]
    keys = ["\\'", '\\"', "\\n", "\\r", "\\t"]
    global special_char
    for i in range(len(special)):
        hex_num = hex(ord(special[i]))
        special_char[keys[i]] = hex_num[2:]

    count = 1
    # each packet and its hex values
    for key, values in pkts_hex.items():
        lst = []
        for hexs in values:
            # take out the newline in the last element
            if hexs == values[-1]:
                hexs = hexs[:-2]

            # no other chars only hex
            if len(hexs) == 2:
                lst.append(hexs)
            # other chars
            else:
                # store the hex first
                lst.append(hexs[:2])

                # convert char to hex
                lst = chars_to_hex(lst, hexs[2:])

        # format of wireshark hexdump
        ethernet = lst[:14]
        ip = lst[14:34]
        udp = lst[34:42]
        quic = lst[42:]
        print(count, end=" ")
        print(udp, end= " ")
        print(quic[:3])
        get_quic_info(quic)
        count += 1

    
    df_to_csv()


if __name__ == "__main__":
    main()