#!/usr/bin/env bash

if [ $1 ]; then
  if [ $1 == "dev" ]; then
    PYTHON_ENV=development python/bin/python main.py
  elif [ $1 == "pd" ]; then
    PYTHON_ENV=production forever --uid blog-backend -c python/bin/python -a -l logs/forever.log main.py
  fi
else
    PYTHON_ENV=development python/bin/python main.py
fi
