#!/bin/bash
# scripts/new-service/copy-module-scripts.sh
# Usage: source this file after service dir is created
mkdir -p scripts
cp -R ../scripts/new-module scripts/
cp -R ../scripts/new-module.sh ./
