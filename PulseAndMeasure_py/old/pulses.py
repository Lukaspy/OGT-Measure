""" Generate test pulses """

from WF_SDK import device, scope, wavegen
import ctypes


def single_pulse(pulsewidth, samples):
    """
        Generate a single pulse of variable length

        parameters: -pulsewidth in percentage

        returns: -a list of the generated values

    """

    generated = []
    samples_on = round(samples * (pulsewidth / 100))

# Generate the "on" values
    for i in range(0, samples_on):
        generated.append(1)

# Fill the rest of the list with zeros
    for i in range(samples_on, samples):
        generated.append(0)

    print(generated)
    return generated


def dual_pulse(pulsewidth1, pulsewidth2, separation, samples):
    """
        Generate two pulses of variable width and separation

        parameters: -pulsewidth1 (width of 1st pulse)
                    -pulsewidht2 (width of 2nd pulse)
                    -separation  (distance bt the pulses)

        returns: -a list of the generated values
    """


def dual_ramp(rampwidth, separation, samples):
    """
        Generate two ramps of variable width (and ramp rate) and separation

        parameters: -rampwidth (width of the ramps which also determines rate)
                   -separation (distance bt the ramps)


        returns: -a list of the generated values
    """

def csv_import(file):
    """
        Take a csv file of an arbitrary waveform and import it to be generated

        parameters: -file path

        returns: -a list of the imported values
    """
