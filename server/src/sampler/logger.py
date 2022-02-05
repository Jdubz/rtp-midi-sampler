import logging
import json
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def log(tag, msg):
  logger.info(tag + ': ' + msg)

def error(tag, err):
  logger.info(tag + ': ' + str(err))
