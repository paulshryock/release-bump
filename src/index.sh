#!/usr/bin/env bash

set -e

if [[ $(which git) == *"not found"* ]]; then
	echo "[release-bump] git is required, and not installed."
	return 1
fi

if [[ $1 == '' ]]; then
	printf '\n    Description:'
	printf '\n        Bumps unreleased docblock @since version.'
	printf '\n'
	printf '\n    Usage:'
	printf '\n        release-bump <new_version>'
	printf '\n'
	printf '\n    Examples:'
	printf '\n        release-bump 2.0.0'
	printf '\n\n'
	return 0
fi

if ! [[ "$1" =~ $\d+\.\d+\.\d+^ ]]; then
	return 0
fi

git ls-files | xargs sed -i "s/\(@since\s\+\)unreleased/\1$1/g"
