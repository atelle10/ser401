deploy_dir := justfile_directory() / "deployment"

compose := "docker compose -f " + deploy_dir / "docker-compose.yml --env-file " + deploy_dir / ".env --project-directory " + deploy_dir

start service:
    @echo "stopping {{service}} service.."\

    -{{compose}} stop {{service}}
    -{{compose}} rm -f {{service}}

    @echo "starting {{service}} service.."

    {{compose}} up -d {{service}}

start-all:
    @echo "stopping all services.."

    {{compose}} down

    @echo "starting all services.."

    {{compose}} up -d

start-clean service:
    @echo "stopping {{service}} service.."

    -{{compose}} stop {{service}}
    -{{compose}} rm -f {{service}}

    @echo "building {{service}} from scratch.."

    {{compose}} build --no-cache {{service}}

    @echo "starting {{service}} service.."

    {{compose}} up -d {{service}}

start-clean-all:
    @echo "stopping all services.."

    {{compose}} down

    @echo "building all services from scratch.."

    {{compose}} build --no-cache

    @echo "starting all services.."

    {{compose}} up -d

stop service:
    @echo "stopping {{service}} service.."

    {{compose}} stop {{service}}
    {{compose}} rm -f {{service}}

stop-all:
    @echo "stopping all services.."
    
    {{compose}} down

logs service:
    {{compose}} logs -f {{service}}

logs-all:
    {{compose}} logs -f

status:
    {{compose}} ps
