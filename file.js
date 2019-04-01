const Child_process = require('child_process');
var Spawn = Child_process.spawn;

class File
{
    constructor(config) 
    {
        this.config = config
        this.processqueue = {}
        this.lastId = 0
    }

    getStatus(pid)
    {
        console.log(this.processqueue)
        if(this.processqueue[pid])
        {
            res = this.processqueue[pid]
            res.delete("process")
            return res
        }
        else
            return false
    }

    sendFile(filePath) 
    {
        this.lastId = this.lastId + 1;
        var id = this.lastId
        this.spawnScp(id,filePath)
        return id
        
    }

    spawnScp(idCmd,filePath)
    {
        var args = ["-r",filePath,this.config.user+"@"+this.config.server+":~/"]
        console.log(args.join())
        var scpProcess = Spawn("/usr/bin/scp", args,{'detached':true})
        this.processqueue[idCmd] = 
        {
            'process':scpProcess,
            'cmd':'scp',
            'running':1,
            'error':0
        }
        scpProcess.on('close', (code) => {
            if(code != 0)
            {
                this.processqueue[idCmd] = 
                {
                    'process':scpProcess,
                    'cmd':'scp',
                    'running':0,
                    'error':code
                }
            }
            else
                this.spawnHadoop(idCmd,filePath)
        });

        scpProcess.stdout.on('data', (data) => {
            console.log(`stdout scp: ${data}`);
        });
        
        scpProcess.stderr.on('data', (data) => {
        console.log(`stderr scp: ${data}`);
        });
    }

    spawnHadoop(idCmd,filePath)
    {
        "hadoop fs -put toto.txt /user/darbouxtom/toto.txt"
        var args = [this.config.user+"@"+this.config.server, "'hadoop fs -put "+filePath+" /user/"+this.config.user+"/"+filePath+"'"]
        console.log(args.join())
        var sshProcess = Spawn("/usr/bin/ssh", args,{'detached':true,shell:true})
        this.processqueue[idCmd] = 
        {
            'process':sshProcess,
            'cmd':'ssh hadoop',
            'running':1,
            'error':0
        }
        sshProcess.on('close', (code) => {
            if(code != 0)
            {
                this.processqueue[idCmd] = 
                {
                    'process':sshProcess,
                    'cmd':'ssh hadoop',
                    'running':0,
                    'error':code
                }
            }
            else
                this.spawnHadoop(idCmd)
        });

        sshProcess.stdout.on('data', (data) => {
            console.log(`stdout ssh: ${data}`);
        });
        
        sshProcess.stderr.on('data', (data) => {
        console.log(`stderr ssh: ${data}`);
        });
    }

}

module.exports = File