TMUX_COMMMAND ="tmux send-keys -t server '^C' C-m;tmux send-keys -t server 'cd main/post_meeting/back/server/' C-m ;tmux send-keys -t server 'sh docker_reload.sh' C-m"


dev:
	docker-compose up -d

dev-down:
	docker-compose down

start-server:
	uvicorn app.main:app --reload --port=8080

down-server:
	pkill uvicorn

install-modules:
	pip install "fastapi[all]" fastapi-mail "fastapi-jwt-auth[asymmetric]" "passlib[bcrypt]" pymongo

push:
	docker build . --platform=linux/amd64 -t sehyunsix/postmeeting-api:0.2.6
	docker push sehyunsix/postmeeting-api:0.2.6
	ssh -i ~/.ssh/"sol.pem" ec2-user@ec2-3-25-126-189.ap-southeast-2.compute.amazonaws.com $(TMUX_COMMMAND) | echo yes