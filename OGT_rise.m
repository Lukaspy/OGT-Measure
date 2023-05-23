myDir = uigetdir; %gets directory
myFiles = dir(fullfile(myDir,'*.csv')); %gets all csv files in struct
for k = 1:length(myFiles)
    baseFileName = myFiles(k).name;
    fullFileName = fullfile(myDir, baseFileName);
    Array = csvread(baseFileName, 1, 0);
    col1 = Array(:, 1);
    col2 = Array(:, 2);
    plot(col1, col2)
    hold on
    risetime(col2,col1)
    disp(fullFileName)
end    
