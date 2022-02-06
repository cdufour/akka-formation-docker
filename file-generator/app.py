'''
Author: Christophe DUFOUR
Mail: cdufour@opusidea.eu
'''

import string
import random
import time
import os

path = "files"
isExist = os.path.exists(path)
if not isExist:
  os.mkdir(path)
  print("[+] dir files created")

def generate_rand_filename():
	rand_wd = ""
	for n in range(10):
		rand_wd += random.choice(string.ascii_lowercase)
	return rand_wd + ".txt"

while True:
  filename = generate_rand_filename()
  
  with open("files/" + filename, "w") as f:
	  f.write("hello")
  
  print("[+] file: " + filename + " generated")
  time.sleep(10)
