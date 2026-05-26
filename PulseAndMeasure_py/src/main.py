#! /usr/bin/env python3

import argparse

import numpy as np

import pulses

from pydwf import (DwfLibrary, DwfEnumConfigInfo, DwfAnalogOutIdle, DwfTriggerSource, PyDwfError,
                   DwfAnalogOutNode, DwfAnalogOutFunction, DwfAcquisitionMode)
from pydwf.utilities import openDwfDevice


def main():
    parser = argparse.ArgumentParser(description="Generate a selected pulse and capture an Osciliscope measurement.")

    parser.add_argument(
            "-sn", "--serial-number-filter",
            type=str,
            nargs='?',
            dest="serial_number_filter",
            help="serial number filter to select a specific Digilent Waveforms device"
            )

    parser.add_argument(
            "-wf", "--waveform",
            type=str,
            nargs='?',
            dest="user_waveform",
            help="name of waveform to be generated"
            )

    if args.user_waveform is not None:
        # Arm the scope

        # Generate waveform

        try:
            pulses.generate_waveform(args.user_waveform)
        except:  # TODO which error goes here?
            print("invalid waveform name. Available waveforms: \n " + pulses.available())
        # return scope data




if __name__ == "__main__":
    main()
