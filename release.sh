#!/bin/bash
set -e

source ../credentials
export GITHUB_USERNAME
export GITHUB_PASSWORD

# build
grunt
echo

# dry run
grunt "release:$1" --no-write

echo -n "\nexecute 'grunt release:$1'? (type yes to confirm): "
read -n3 answer

if [ "$answer" == 'yes' ]; then
  echo -e "\n"
  grunt "release:$1"
else
  echo -e "\n\n\033[1;31mAbortet.\033[0m"
fi
