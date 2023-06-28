//Pulse and Measure

if(!('Wavegen' in this) || !('Scope' in this)) throw "Please open a Scope and a Wavegen instrument";

//Set wavegen to generate 1 pulse 
Wavegen.Channel1.Mode.text = "Simple";
Wavegen.Synchronization.text = "Independent"
Wavegen.Channel1.Simple.Type.text = "Pulse";
Wavegen.Channel1.Simple.Frequency.value = 1000;
Wavegen.Channel1.States.Auto.value = 1;
Wavegen.Channel1.States.Repeat.value = 1;
Wavegen.Channel1.Simple.Amplitude.value = 3.3;
Wavegen.Channel1.Simple.Period.text = "3ms"

Scope.Trigger.Trigger.text = "Repeated";
Scope.Trigger.Type.text = "Edge";
Scope.Trigger.Condition.text = "Either";
Scope.Trigger.Source.text = "Wavegen 1";

var save_user = Tool.question("Save Aquisitions?");
if (save_user) {
    var baseFile = Tool.getSaveFile("Filename/Directoty", "~/Documents/CampbellResearch")//Tool.getText("Filename/directory")
}
var repeat =  Tool.getText("Repeat times?")
var delay = Tool.getText("Delay? (s)")
print(baseFile)


//Pulse width in percentage
var t1_user = 10;
var t2_user = 20;
var t3_user = 20;
var t4_user = 1/100;

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

function generateRamps(t1, t2) {
//t1 is the ramp duration
//t2 is the length of steady state (once ramp reaches 1). Default is 0
//returns a list of values ranging from 0 - 1. 
    generated = []
    //scale times to percentages and 4096 samples 
    t1 *= 4096/100;
    t2 *= 4096/100;
    rate = 1/t1
    
    //generate first ramp
    for (var i = 0; i< t1; i++) {
        generated[Math.round(i)] = i*rate;
    }
    
    //generate steadystate (if used)
    for (var i = t1; i <= t1+t2; i++) {
        generated[Math.round(i)] = 1
        print("here " + i)
    }
    
    //generate second pulse
    var j = 0
    for (var i = t1+t2; i <= t1+t1+t2; i++) {
        generated[Math.round(i)] = (j)*rate;
        j++
    }

    //generate second steadystate (if used)
    for (var i = t1+t1+t2; i <= t1+t1+t2+t2; i++) {
        generated[Math.round(i)] = 1
    }
    return generated
}


if (Tool.question("2 Pulses?")) {
    Wavegen.Channel1.Mode.text = "Custom";
    t4_factor = t4_user
    for (var i = 1; i <= repeat; i++) {
        arbPulse = generatePulse(t1_user, t3_user, t4_factor);
        Wavegen.Custom.set("pulse" + i, arbPulse);
        Wavegen.Channel1.Mode.text = "Custom";
        Wavegen.Channel1.Custom.Type.text = "pulse" + i;
        Wavegen.Channel1.Custom.Amplitude.value = 3.3;
        Wavegen.Channel1.Custom.Frequency.value = 5;
        pulseAndCapture(save_user);
        wait(parseInt(delay));
        t4_factor *= 2;
    }

} else if (Tool.question("2 ramps")) {
    Wavegen.Channel1.Mode.text = "Custom";
    for (var i = 1; i <= repeat; i++) {
        arbPulse = generateRamps(t1_user, t2_user)
        Wavegen.Custom.set("ramp" + i, arbPulse);
        Wavegen.Channel1.Mode.text = "Custom";
        Wavegen.Channel1.Custom.Type.text = "ramp" + i;
        pulseAndCapture(save_user);
        wait(parseInt(delay));
    }

}

else{
    for (var i = 1; i <= repeat; i++) {
        pulseAndCapture();
        if (i != repeat) {
            wait(parseInt(delay));
        }
    }
}



