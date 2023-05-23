//Pulse and Measure

if(!('Wavegen' in this) || !('Scope' in this)) throw "Please open a Scope and a Wavegen instrument";

//Set wavegen to generate 1 pulse 
Wavegen.Channel1.Mode.text = "Simple";
Wavegen.Synchronization.text = "Independent"
Wavegen.Channel1.Simple.Type.text = "Pulse";
Wavegen.Channel1.Simple.Frequency = 1000;
Wavegen.Channel1.Simple.Phase = 180;
Wavegen.States.Repeat.value = 1;
Wavegen.Channel1.Simple.Amplitude = 3;

Scope.Trigger.Trigger.text = "Repeated";
Scope.Trigger.Type.text = "Edge";
Scope.Trigger.Condition.text = "Either";
Scope.Trigger.Source.text = "Wavegen 1";

Scope.single();
Wavegen.run();