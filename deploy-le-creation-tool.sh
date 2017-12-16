ionic cordova build browser --prod;
rm -rf firebase/le-submission-tool/www/;
cp -R www firebase/le-submission-tool/www/;
cd firebase/le-submission-tool;
firebase deploy;
