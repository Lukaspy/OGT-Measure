from pydwf import (DwfLibrary, DwfEnumConfigInfo, DwfAnalogOutIdle, DwfTriggerSource, PyDwfError, # E: line too long (97 > 79 characters)
                  DwfAnalogOutNode, DwfAnalogOutFunction, DwfAcquisitionMode)
from pydwf.utilities import openDwfDevice

waveforms = {"single_pulse": single_pulse, "double_pulse": double_pulse, "single_ramp": single_ramp, "double_ramp": double_ramp, "triple_ramp": triple_ramp}

def single_pulse():
    break


def generate_waveform(analogOut, waveform, amplitude, channel=0):
    """
    Get desired wavform data set and play

    """

    # Check if waveform exists and get the waveform data
    if waveform in waveforms:
        waveform_data = waveforms[waveform]()

    else:
        raise NameError("The desired wavefrom does not exist")

    analogOut.reset(channel)

    #TODO: setup analog out(offset, amplitude,etc) . Run analog Out
    
