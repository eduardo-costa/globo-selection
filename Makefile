# Diretorios raiz onde irão residir configs e dados
DeployRoot  = /usr/local/var/globo-challenge

NGINXRoot   = $(DeployRoot)/nginx
NGINXLog    = $(NGINXRoot)/log

MongoDBRoot = $(DeployRoot)/mongodb
MongoDBLog  = $(MongoDBRoot)/log

ClientRoot  = $(DeployRoot)/client
ServerRoot  = $(DeployRoot)/server
ServerLog   = $(ServerRoot)/log

LocalServerConfig = ./server/config
LocalServerData   = ./server/deploy
LocalClientData   = ./client/deploy

LinuxStdBase = trusty

all: 	
	sudo git pull
	make clean 
	make install

clean:
	sudo rm -r $(DeployRoot)

mongo-install:
	# Instala lists do MongoDB
	sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10	
	echo "deb http://repo.mongodb.org/apt/ubuntu "$(LinuxStdBase)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
	
	# Atualiza os packs do apt-get
	sudo apt-get update
	
	# Instala o MongoDB
	sudo apt-get install -y mongodb-org
	
	make mongo-run
	
	
mongo-run:
	#Copia os arquivos de configuração mongodb
	sudo cp -r $(LocalServerConfig)/mongodb/ $(DeployRoot)
		
	# Inicia o servidor mongodb com a configuraçao especificada	
	sudo mongod --config $(MongoDBRoot)/mongod.conf
	
	
nginx-install:	
	
	# Instala o NGINX
	sudo apt-get install -y nginx
	
	make nginx-update
	
nginx-update:
	
	# Interrompe o NGINX
	sudo nginx -s stop
	
	# Remove o site antigo e recria a pasta
	sudo rm -r $(ClientRoot)
	sudo mkdir -p $(ClientRoot)
		
	# Copia os arquivos de configuracao nginx
	sudo cp -r $(LocalServerConfig)/nginx/* $(NGINXRoot)
	
	# Copia arquivos do site
	sudo cp -r $(LocalClientData)/* $(ClientRoot)
			
	# Substitui os arquivos de configuracao do nginx
	sudo nginx -c $(NGINXRoot)/nginx.conf
	
	# Reinicia para ativá-los
	sudo nginx -s reload
	
	
node-install:
	
	# Instalação do NodeJS
	sudo apt-get install -y nodejs
	
	# Forever chama 'node' e não 'nodejs'
	sudo ln -s -f /usr/bin/nodejs /usr/bin/node
	
	# Instalação do NPM
	sudo apt-get install -y npm
	
	# Instala o modulo forever permitindo que o app node rode como um daemon
	sudo npm install forever -g
	
	# Instala os pacotes NPM necessários
	sudo npm install
	
	# Inicia o serviço do nodejs
	make node-run
	
node-run:
	sudo forever stopall
	sudo forever start -a -l $(ServerLog)/log.log -e $(ServerLog)/err.log -o $(ServerLog)/out.log --workingDir $(LocalServerData) $(LocalServerData)/app-paredao.js -vvvv
	
install:
	
	# Cria diretórios principais
	sudo mkdir -p $(DeployRoot)
	sudo mkdir -p $(ServerLog)
	sudo mkdir -p $(NGINXRoot)
	sudo mkdir -p $(NGINXLog)
	sudo mkdir -p $(ClientRoot)
	sudo mkdir -p $(MongoDBRoot)
	sudo mkdir -p $(MongoDBLog)
	
	make nginx-install
	make node-install
	make mongo-install
	
	
update:
	# Atualiza os arquivos
	sudo git pull
	
	# Instala/Atualiza os pacotes NPM necessários
	sudo npm install
		
	make nginx-update
	
	make node-run
	
	
	
	
