//Pulse and Measure

if(!('Wavegen' in this) || !('Scope' in this)) throw "Please open a Scope and a Wavegen instrument";

//Set scope to trigger off wavegen1
Scope.Trigger.Trigger.text = "Repeated";
Scope.Trigger.Type.text = "Edge";
Scope.Trigger.Condition.text = "Either";
Scope.Trigger.Source.text = "Wavegen 1";

//Set wavegen to only generate one pulse
Wavegen.Channel1.States.Auto.value = 1;
Wavegen.Channel1.States.Repeat.value = 1;

var save_user = Tool.question("Save Acquisitions?");
if (save_user) {
    var baseFile = Tool.getSaveFile("Filename/Directoty", "/")//Tool.getText("Filename/directory")
}
var repeat =  Tool.getText("Repeat times?")
var delay = Tool.getText("Delay? (s)")
print(baseFile)

//Max led voltage
var led_voltage = 3.3;

//Single pulse period (2x pulsewidth)
var single_period = "200 ms";

//Pulse width in percentage
var ramp_t1_user = 15;
var ramp_t2_user = 5;
var ramp_t3_user = 0.5;

//Double square pulse
var t1_user = 20;
var t3_user = 10;
var t4_user = .1;

function pulseAndCapture(save) {
    Scope1.single();
    wait(.1);
    Wavegen.run();
    Scope1.wait();
    if (save) {
        Scope1.Export(baseFile+i.toString()+".csv", szView = "", fComments = false, fHeader = true, fLabel = true, fHeaderAsComment = false, szNotes = "")
    }
}

function generatePulse(t1,t3,t4) {
        generated = [];
        
        //scale times and convert to decimals 
        t1 *= 4096/100;
        t3 *= 4096/100;

        for (var i = 0; i < t1; i++){
            generated[Math.round(i)] = 1;
        }
        for (var t = t1; t < (t1+(t1*t4)); t++) {
            generated[Math.round(t)] = 0;
        }

        for (var i = (t1+(t1*t4)); i < (((t1+(t1*t4) + t3))); i++) {
            generated[Math.round(i)] = 1;
        }

        for (var i = (((t1+(t1*t4) + t3))); i <= 4096; i++) {
            generated[Math.round(i)] = 0;
        }
        return generated
        
        
}

function generateRamps(t1, t2, t3) {
    generated = []

    t1 *= 100
    t2 *= 100
    t3 *= 100
    rate = 1/t1
    offset = .25; 
    
    //Generate first ramp
    for (var i = 0; i < t1; i++) {
        generated[Math.round(i)] = (i*rate)+.25;
    }

    //generate first steadystate (if used)
    for (var i = t1; i <= t1+t2; i++) {
        generated[Math.round(i)] = 1
    }

    //generate ramp spacing
    for (var i = t1+t2; i <= t1+t2+t3; i++) {
            generated[Math.round(i)] = 0;
    }

    //Generate second ramp
    var j = 0;
    for (var i = t1+t2+t3; i <= (2*t1)+t2+t3; i++) {
        generated[Math.round(i)] = (j*rate)+.25;
        j++
    }
    
    //Generate Steady State 2
    for (var i = (2*t1)+t2+t3; i <= (2*t1)+(2*t2)+t3; i++) {
        generated[Math.round(i)] = 1;
    }

    //zero extra space
    for (var i = (2*t1)+(2*t2)+t3; i <= 10000; i++) {
        generated[Math.round(i)] = 0;
    } 


    return generated
}

function tripleRamp(t1, t2, t3) {
    generated = []

    t1 *= 100
    t2 *= 100
    t3 *= 100
    rate = 1/t1
    offset = .25; 
    
    //Generate first ramp
    for (var i = 0; i < t1; i++) {
        generated[Math.round(i)] = (i*rate)+.25;
    }

    //generate first steadystate (if used)
    for (var i = t1; i <= t1+t2; i++) {
        generated[Math.round(i)] = 1
    }

    //generate ramp spacing
    for (var i = t1+t2; i <= t1+t2+t3; i++) {
            generated[Math.round(i)] = 0;
    }

    //Generate second ramp
    var j = 0;
    for (var i = t1+t2+t3; i <= (2*t1)+t2+t3; i++) {
        generated[Math.round(i)] = (j*rate)+.25;
        j++
    }
    
    //Generate Steady State 2
    for (var i = (2*t1)+t2+t3; i <= (2*t1)+(2*t2)+t3; i++) {
        generated[Math.round(i)] = 1;
    }
    
    //generate ramp spacing 2
    for (var i = (2*t1)+(2*t2)+t3; i <= (2*t1)+(2*t2)+(2*t3); i++) {
            generated[Math.round(i)] = 0;
    }

    //generate ramp 3
    var j = 0;
    for (var i = (2*t1)+(2*t2)+(2*t3); i <= (3*t1)+(2*t2)+(2*t3); i++) {
        generated[Math.round(i)] = (j*rate)+.25;
        j++
    }
    
    //generate steadystate 3
    for (var i = (3*t1)+(2*t2)+(2*t3); i <= (3*t1)+(3*t2)+(2*t3); i++) {
        generated[Math.round(i)] = 1;
    }

    //zero extra space
    for (var i = (3*t1)+(3*t2)+(2*t3); i <= 10000; i++) {
        generated[Math.round(i)] = 0;
    } 

    return generated
}

if (Tool.question("Single Pulse?")) {

    //Set wavegen to generate 1 pulse 
    Wavegen.Channel1.Mode.text = "Simple";
    Wavegen.Synchronization.text = "Independent"
    Wavegen.Channel1.Simple.Type.text = "Pulse";
    Wavegen.Channel1.Simple.Amplitude.value = led_voltage;
    Wavegen.Channel1.Simple.Period.text = single_period;

    for (var i = 1; i <= repeat; i++) {
        pulseAndCapture(save_user);
        wait(parseInt(delay));
    }

} else if (Tool.question("2 Pulses?")) {
    Wavegen.Channel1.Mode.text = "Custom";
    Wavegen.Synchronization.text = "Independent"
    Wavegen.Channel1.Custom.Amplitude.value = led_voltage;
    Wavegen.Channel1.Custom.Offset.value = 0;

    t4_factor = t4_user

    for (var i = 1; i <= repeat; i++) {
        arbPulse = generatePulse(t1_user, t3_user, t4_factor);
        Wavegen.Custom.set("pulse" + i, arbPulse);
        Wavegen.Channel1.Custom.Type.text = "pulse" + i;
        Wavegen.Channel1.Custom.Amplitude.value = led_voltage;
        Wavegen.Channel1.Custom.Frequency.value = 5;
        pulseAndCapture(save_user);
        wait(parseInt(delay));
        t4_factor *= 2;
    }

} else if (Tool.question("2 ramps")) {
    Wavegen.Channel1.Mode.text = "Custom";
    Wavegen.Channel1.Custom.Amplitude.value = 1;
    Wavegen.Channel1.Custom.Offset.value = 2.3;

    for (var i = 1; i <= repeat; i++) {
        arbPulse = generateRamps(ramp_t1_user, ramp_t2_user, ramp_t3_user)
        Wavegen.Custom.set("ramp" + i, arbPulse);
        Wavegen.Channel1.Mode.text = "Custom";
        Wavegen.Channel1.Custom.Type.text = "ramp" + i;
        pulseAndCapture(save_user);
        wait(parseInt(delay));
    }

} else if (Tool.question("3 ramps")) {

    Wavegen.Channel1.Mode.text = "Custom";
    Wavegen.Channel1.Custom.Amplitude.value = 1;
    Wavegen.Channel1.Custom.Offset.value = 2.3;

// Check if user wants space bt ramps to increase each iteration
    if (Tool.question("Increase ramp spacing each time?")) {
        for (var i = 1; i <= repeat; i++) {
            var arbPulse = [];

            //Generate ramps with 0ms, 1ms, 5ms, and 15 ms spacing
            switch(i) {
                case 1:
                    arbPulse = tripleRamp(ramp_t1_user, ramp_t2_user, 0);
                    break;
                case 2:
                    arbPulse = tripleRamp(ramp_t1_user, ramp_t2_user, ramp_t3_user);
                    break;
                case 3:
                    arbPulse = tripleRamp(ramp_t1_user, ramp_t2_user, ramp_t3_user*5);
                    break;
                case 4:
                    arbPulse = tripleRamp(ramp_t1_user, ramp_t2_user, ramp_t3_user*15);
                    break;

            }

            Wavegen.Custom.set("ramp" + i, arbPulse);
            Wavegen.Channel1.Mode.text = "Custom";
            Wavegen.Channel1.Custom.Type.text = "ramp" + i;
            pulseAndCapture(save_user);
            wait(parseInt(delay));

        }
    } else {
        
        var arbPulse = [];
        arbPulse = tripleRamp(t1_user, t2_user, t3_user);
        Wavegen.Custom.set("triple_ramp", arbPulse);
        
        for (var i = 1; i <= repeat; i++) {
            pulseAndCapture(save_user);
            wait(parseInt(delay));
        }

        

    }
}



