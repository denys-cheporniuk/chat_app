db-up:
	docker compose -f ./compose-files/docker-compose.db.yml up

api-up:
	npm --prefix ./api run start:dev

frontend-up:
	npm --prefix ./frontend run dev

stop-containers:
	docker stop $$(docker ps -a -q)

remove-containers:
	docker rm $$(docker ps -a -q)

clean-images:
	docker rmi $$(docker images | grep "^<none>" | awk "{print $3}")

clean-volumes:
	docker volume rm $$(docker volume ls -q)

clean:
	-make stop-containers
	-make remove-containers
	-make clean-images
	-make clean-volumes
