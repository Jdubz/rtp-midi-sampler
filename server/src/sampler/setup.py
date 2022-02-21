#!/usr/bin/env python

from distutils.core import setup
from Cython.Build import cythonize
import numpy

setup(
  name='Sampler',
  version='1.0',
  description='network midi sampler',
  author='Josh Wentworth',
  author_email='contact@joshwentworth.com',
  url='https://github.com/Jdubz/rtp-midi-sampler.git',
  ext_modules = cythonize(['samplerbox_audio.pyx']),
  include_dirs=[numpy.get_include()]
)
