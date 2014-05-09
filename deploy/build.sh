#!/bin/bash
#
# Compile our linux executable
##

# get paths
rootpath="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
basepath="$rootpath/..";

# zip all files to nw archive
echo 'Zipping directories'
cd $basepath
zip -9 -q -r ./opal.nw ./* --exclude=*.DS_Store* --exclude=*.git* --exclude=*deploy* --exclude=*build*

# copy nw.pak from current build node-webkit
cp /opt/node-webkit/nw.pak ./nw.pak

# compilation to executable form
mkdir -p ./build/linux
cat /opt/node-webkit/nw ./opal.nw > ./build/linux/opal && chmod +x ./build/linux/opal

# move nw.pak to build folder
mv ./nw.pak ./build/linux/nw.pak

# remove my-app.nw
rm ./opal.nw

# run application
./build/linux/opal