from WF_SDK import device, scope, wavegen   # import instruments
import pulses
import ctypes
import matplotlib.pyplot as plt   # needed for plotting

"""-----------------------------------------------------------------------"""

# connect to the device
device_data = device.open()

"""-----------------------------------"""

dwf = ctypes.cdll.LoadLibrary("libdwf.so")

# initialize the scope with default settings
scope.open(device_data, sampling_frequency=1e06)

# Set scope to trigger on wavegen
scope.trigger(device_data, enable=True, source=scope.trigger_source.wavegen1,
              channel=1)

# arm channel 1 for a single shot capture
scope.single_arm(device_data, 1)

# generate single pulse
wavegen.generate(device_data, channel=1, function=wavegen.function.square,
                 offset=0, frequency=10e03, amplitude=1, run_time=1/10e03,
                 repeat=1)#, data=pulses.single_pulse(50, 4096))

buffer = scope.single_read(device_data, 1)


# generate buffer for time moments
time = []
for index in range(len(buffer)):
    # convert time to ms
    time.append(index * 1e03 / scope.data.sampling_frequency)


# plot
plt.plot(time, buffer)
plt.xlabel("time [ms]")
plt.ylabel("voltage [V]")
plt.show()

# reset the scope
scope.close(device_data)

# reset the wavegen
wavegen.close(device_data)

"""-----------------------------------"""

# close the connection
device.close(device_data)
