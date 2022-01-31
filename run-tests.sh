#!/bin/bash

DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

help () {
	echo '\nThis script helps to run tests for Schwepp'
	echo 'Usage:'
	echo '    ./run-tests.sh < service1 || service2 || all>'
}

if [ -n "$1" ]; then
	if [[ "$1" == '-h' || "$1" == '--help' ]]; then
		help
		exit
	fi
	FILTER=($1)
fi

ID=$(uuidgen)
node $DIR/test-routes/base.js $ID $FILTER
echo
