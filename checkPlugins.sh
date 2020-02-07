pluginPaths=$(find plugins/enabled/* -maxdepth 0 -type d);

for pluginPath in $pluginPaths; do
    dependencies=$(find $pluginPath -type f -name '*.js' -and -not -name '*.test.js'|xargs grep -R \.js|awk '{print $NF}'|awk -F\' '{print$2}'|grep -P '\.\./[a-z]+-'|sed -e 's!\.\./!!g'|awk -F/ '{print$1}'|sort -u|grep -v core-test|xargs);
    components=$(find $pluginPath -type f -name '*.js' -and -not -name '*.test.js'|sed -e 's!'$pluginPath'/!!g');

    node utils/validateDependencies.js $pluginPath/plugin.json $dependencies;
    node utils/validateComponents.js $pluginPath/plugin.json $components;
done
