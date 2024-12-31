const commandCompletions = {
    'curl': [
        'localhost:8080/api/profile',
        'localhost:8080/api/experience',
        'localhost:8080/api/projects',
        'localhost:8080/api/links',
        'localhost:8080/actuator/health'
    ],
    'docker': ['ps', 'logs user-service'],
    'kubectl': ['get pods', 'describe deployment user-service'],
    'redis-cli': ['info', 'get user:achievements'],
    'ls': ['-la', '-l'],
    'cd': ['projects/', 'config/']
};

const fileSystem = {
    'projects/': {
        'user-service/': {
            'pom.xml': 'Maven project file',
            'src/': {
                'main/': {
                    'UserService.java': 'Spring Boot main application',
                    'UserController.java': 'REST endpoints'
                }
            }
        },
        'websocket-service/': {
            'main.go': 'Go WebSocket server',
            'handlers.go': 'WebSocket handlers'
        }
    },
    'config/': {
        'application.yml': 'Spring configuration',
        'kubernetes/': {
            'deployment.yml': 'K8s deployment config'
        }
    }
};

let currentDirectory = '/';

const commands = {
    help: () => {
        writeLine('\x1b[1m\x1b[38;5;81mKullanılabilir Komutlar:\x1b[0m');
        writeLine('');
        writeLine('\x1b[1m\x1b[38;5;214mSystem Commands:\x1b[0m');
        writeLine('    clear                   Terminal ekranını temizler');
        writeLine('    help                    Bu yardım mesajını gösterir');
        writeLine('');
        writeLine('\x1b[1m\x1b[38;5;214mProfile & Links:\x1b[0m');
        writeLine('    curl localhost:8080/api/profile    CV ve profil bilgileri');
        writeLine('    curl localhost:8080/api/experience İş deneyimleri');
        writeLine('    curl localhost:8080/api/projects   Proje detayları');
        writeLine('    curl localhost:8080/api/links      GitHub ve LinkedIn profilleri');
        writeLine('');
        writeLine('\x1b[1m\x1b[38;5;214mTech Stack Demo:\x1b[0m');
        writeLine('    docker ps/logs          Container ve uygulama durumu');
        writeLine('    kubectl get pods        Kubernetes deployment detayları');
        writeLine('    redis-cli get          Başarılar ve sertifikalar');
        return Promise.resolve();
    },

    'kubectl': async (args) => {
        if (args[0] === 'get' && args[1] === 'pods') {
            await simulateLoading('Fetching pods ');
            writeLine('NAME                                     READY   STATUS    RESTARTS   AGE');
            writeLine('user-service-7d4f79f4b9-x2jl8           1/1     Running   0          2d');
            writeLine('auth-service-5c6b7d8f9a-k3m4n           1/1     Running   0          2d');
            writeLine('notification-service-3f4g5h6j7-w8x9y    1/1     Running   0          2d');
            writeLine('redis-master-0                          1/1     Running   0          5d');
            writeLine('kafka-0                                 1/1     Running   0          5d');
        } else if (args[0] === 'logs') {
            await simulateLoading('Fetching logs ');
            writeLine('2024-01-15 10:23:45.123  INFO 1 --- [main] c.s.UserServiceApplication : Starting UserServiceApplication');
            writeLine('2024-01-15 10:23:46.234  INFO 1 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer : Tomcat initialized');
            writeLine('2024-01-15 10:23:47.345  INFO 1 --- [main] o.s.b.a.e.web.EndpointLinksResolver : Exposing 13 endpoint(s)');
        } else if (args[0] === 'describe' && args[1] === 'deployment' && args[2] === 'user-service') {
            writeLine('Name:                   user-service');
            writeLine('Namespace:              production');
            writeLine('CreationTimestamp:      Mon, 15 Jan 2024 10:23:45 +0300');
            writeLine('Labels:                 app=user-service');
            writeLine('                       team=backend');
            writeLine('Annotations:            deployment.kubernetes.io/revision: 3');
            writeLine('Replicas:               3 desired | 3 updated | 3 total | 3 available');
            writeLine('Strategy:               RollingUpdate');
            writeLine('  Max surge:            1');
            writeLine('  Max unavailable:      0');
            writeLine('Pod template:');
            writeLine('  Labels:               app=user-service');
            writeLine('  Containers:');
            writeLine('   user-service:');
            writeLine('    Image:              registry.company.com/user-service:1.2.3');
            writeLine('    Ports:              8080/TCP, 8081/TCP');
            writeLine('    Environment:');
            writeLine('      SPRING_PROFILES_ACTIVE:  production');
            writeLine('      JAVA_OPTS:               -Xms512m -Xmx1024m');
        }
    },

    'curl': async (args) => {
        await simulateLoading('Sending request ', 800);
        if (args.includes('localhost:8080/api/profile')) {
            await simulateLoading('Fetching profile data ', 500);
            writeLine('HTTP/1.1 200 OK');
            writeLine('Content-Type: application/json');
            writeLine('');
            writeLine(JSON.stringify({
                developer: {
                    name: "Backend Developer",
                    current_position: {
                        company: "Sahibinden.com",
                        role: "Software Developer",
                        period: "May 2022 - Present",
                        projects: [
                            "Kurumsal iş uygulamaları için backend servisleri",
                            "Mikroservis dönüşüm projesi",
                            "Yüksek ölçeklenebilir sistemler"
                        ]
                    },
                    previous_experience: [{
                        company: "Hitit",
                        role: "Software Developer (Part-time)",
                        period: "Feb 2022 - May 2022",
                        focus: ["Java Development", "Unit Testing"]
                    }],
                    education: {
                        university: "THK University",
                        degree: "Computer Engineering",
                        gpa: 3.33,
                        achievements: ["Department First", "Faculty Third"]
                    },
                    skills: {
                        languages: ["Java", "Kotlin", "Go"],
                        frameworks: ["Spring Boot", "JSF"],
                        databases: ["PostgreSQL", "MongoDB", "Redis"],
                        tools: ["Docker", "Kubernetes", "Kafka"]
                    }
                }
            }, null, 2));
        } else if (args.includes('localhost:8080/api/experience')) {
            await simulateLoading('Fetching experience data ', 600);
            writeLine('HTTP/1.1 200 OK');
            writeLine('Content-Type: application/json');
            writeLine('');
            writeLine(JSON.stringify({
                current: {
                    company: "Sahibinden.com",
                    role: "Software Developer",
                    period: "May 2022 - Present",
                    responsibilities: [
                        "Backend service development for corporate applications",
                        "Microservice transformation",
                        "Production optimizations",
                        "Integration testing",
                        "High-scale system design"
                    ],
                    tech_stack: ["Java", "Spring Boot", "Kubernetes", "Kafka"]
                },
                previous: [{
                    company: "Hitit",
                    role: "Software Developer",
                    period: "Feb 2022 - May 2022",
                    type: "Part-time",
                    focus: ["Java Development", "Unit Testing", "Team Collaboration"]
                }]
            }, null, 2));
        } else if (args.includes('api/health')) {
            writeLine('HTTP/1.1 200 OK');
            writeLine('Content-Type: application/json');
            writeLine('');
            writeLine(JSON.stringify({
                status: "UP",
                components: {
                    db: { status: "UP" },
                    redis: { status: "UP" },
                    kafka: { status: "UP" }
                }
            }, null, 2));
        } else if (args.includes('api/metrics')) {
            writeLine('HTTP/1.1 200 OK');
            writeLine('Content-Type: application/json');
            writeLine('');
            writeLine(JSON.stringify({
                "jvm.memory.used": 385392944,
                "http.server.requests": 23424,
                "system.cpu.usage": 0.65,
                "hikaricp.connections.active": 12
            }, null, 2));
        } else if (args.includes('localhost:8080/actuator/health')) {
            writeLine('HTTP/1.1 200 OK');
            writeLine('Content-Type: application/json');
            writeLine('');
            writeLine(JSON.stringify({
                status: "UP",
                components: {
                    "userService": { status: "UP" },
                    "db": { status: "UP", details: { database: "PostgreSQL", version: "13.2" }},
                    "redis": { status: "UP", details: { version: "6.2.6" }},
                    "kafka": { status: "UP", details: { brokers: ["kafka-1", "kafka-2"] }}
                }
            }, null, 2));
        } else if (args.includes('localhost:8080/api/projects')) {
            await simulateLoading('Fetching project data ', 600);
            writeLine('HTTP/1.1 200 OK');
            writeLine('Content-Type: application/json');
            writeLine('');
            writeLine(JSON.stringify({
                projects: [{
                    name: "Social Platform Backend",
                    tech_stack: {
                        backend: ["Spring Boot", "Go"],
                        database: ["PostgreSQL", "Redis"],
                        messaging: ["Kafka"],
                        deployment: ["Docker", "Kubernetes", "ArgoCD"]
                    },
                    features: [
                        "Mikroservis mimarisi",
                        "Real-time mesajlaşma (WebSocket)",
                        "Event-driven mimari",
                        "Cache optimizasyonları"
                    ]
                }]
            }, null, 2));
        } else if (args.includes('localhost:8080/api/links')) {
            await simulateLoading('Fetching social links ', 400);
            writeLine('HTTP/1.1 200 OK');
            writeLine('Content-Type: application/json');
            writeLine('');
            writeLine(JSON.stringify({
                social_links: {
                    github: "https://github.com/ogulcanmunogullari",
                    linkedin: "https://www.linkedin.com/in/ogulcanmunogullari/",
                    portfolio: "https://ogulcanmunogullari.com"
                },
                contributions: {
                    total_commits: "1000+",
                    public_repos: 25,
                    languages: ["Java", "JavaScript", "Go", "Python"]
                }
            }, null, 2));
        }
    },

    'docker': async (args) => {
        await simulateLoading('Connecting to docker daemon ', 1000);
        if (args[0] === 'ps') {
            await simulateLoading('Fetching containers ', 800);
            writeLine('CONTAINER ID   IMAGE                         COMMAND                  CREATED          STATUS          PORTS                    NAMES');
            writeLine('a1b2c3d4e5f6   user-service:latest           "java -jar app.jar"      2 days ago       Up 2 days       0.0.0.0:8080->8080/tcp   user-service');
            writeLine('b2c3d4e5f6g7   auth-service:latest           "java -jar app.jar"      2 days ago       Up 2 days       0.0.0.0:8081->8081/tcp   auth-service');
        } else if (args[0] === 'logs') {
            await simulateLoading('Fetching logs ', 800);
            writeLine('2024-01-15 10:23:45.123  INFO 1 --- [main] c.s.UserServiceApplication : Starting UserServiceApplication');
            writeLine('2024-01-15 10:23:46.234  INFO 1 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer : Tomcat initialized');
            writeLine('2024-01-15 10:23:47.345  INFO 1 --- [main] o.s.b.a.e.web.EndpointLinksResolver : Exposing 13 endpoint(s)');
        }
    },

    'redis-cli': async (args) => {
        await simulateLoading('Connecting to Redis ', 500);
        if (args[0] === 'info') {
            writeLine('# Server');
            writeLine('redis_version:6.2.6');
            writeLine('redis_mode:standalone');
            writeLine('# Clients');
            writeLine('connected_clients:123');
            writeLine('# Memory');
            writeLine('used_memory_human:1.23G');
            writeLine('used_memory_peak_human:1.5G');
        } else if (args[0] === 'monitor') {
            writeLine('OK');
            writeLine('1705312345.123456 [0 172.18.0.3:50302] "GET" "user:session:123"');
            writeLine('1705312346.123456 [0 172.18.0.3:50302] "HGET" "user:preferences:456" "theme"');
        } else if (args[0] === 'get' && args[1] === 'user:achievements') {
            writeLine(JSON.stringify({
                academic: {
                    department_rank: 1,
                    faculty_rank: 3,
                    gpa: 3.33
                },
                professional: {
                    hackathon_rank: 7,
                    total_participants: 1350,
                    result: "Job offer from Sahibinden.com"
                }
            }, null, 2));
        }
    },

    'clear': () => {
        term.clear();
        term.write('\x1b[H');
    },

    'pwd': () => {
        writeLine(`/home/backend${currentDirectory}`);
    },

    'ls': async (args) => {
        await simulateLoading('Reading directory ', 300);
        if (args.includes('-l') || args.includes('-la')) {
            writeLine('total 84');
            writeLine('drwxr-xr-x  12 backend dev  4096 Jan 15 10:00 projects/');
            writeLine('drwxr-xr-x   8 backend dev  4096 Jan 15 10:00 config/');
            writeLine('-rw-r--r--   1 backend dev  2300 Jan 15 10:00 docker-compose.yml');
            writeLine('-rw-r--r--   1 backend dev  1250 Jan 15 10:00 README.md');
        } else {
            writeLine('projects/  config/  docker-compose.yml  README.md');
        }
    },

    'cd': (args) => {
        if (!args[0] || args[0] === '~') {
            currentDirectory = '/';
        } else {
            currentDirectory = args[0];
        }
        return Promise.resolve();
    },

    'spring': async (args) => {
        if (args[0] === 'init') {
            await simulateLoading('Creating Spring Boot project ', 1000);
            writeLine('Project created with dependencies:');
            writeLine('- Spring Web');
            writeLine('- Spring Data JPA');
            writeLine('- Spring Security');
            writeLine('- Spring Cache');
            writeLine('- PostgreSQL Driver');
            writeLine('- Kafka');
            writeLine('- Actuator');
        }
    }
};

// Tab completion handler'ı düzeltelim
function handleTabCompletion(line) {
    if (!line) return line;
    
    const args = line.split(' ');
    const cmd = args[0];
    const currentArg = args.length > 1 ? args.slice(1).join(' ') : '';

    if (args.length === 1) {
        const matches = Object.keys(commands).filter(c => c.startsWith(cmd.toLowerCase()));
        if (matches.length === 1) {
            return matches[0];
        } else if (matches.length > 0) {
            // Ortak prefix'i bul
            const commonPrefix = findCommonPrefix(matches);
            if (commonPrefix.length > cmd.length) {
                return commonPrefix;
            }
            // Eşleşenleri göster
            writeLine('');
            matches.forEach(match => term.write(match + '  '));
            writeLine('');
            term.write(terminalState.prompt + line);
            return line;
        }
    } else if (commandCompletions[cmd]) {
        const matches = commandCompletions[cmd].filter(c => c.startsWith(currentArg));
        if (matches.length === 1) {
            return cmd + ' ' + matches[0];
        } else if (matches.length > 0) {
            // Ortak prefix'i bul
            const commonPrefix = findCommonPrefix(matches);
            if (commonPrefix.length > currentArg.length) {
                return cmd + ' ' + commonPrefix;
            }
            // Eşleşenleri göster
            writeLine('');
            matches.forEach(match => term.write(match + '  '));
            writeLine('');
            term.write(terminalState.prompt + line);
            return line;
        }
    }
    return line;
}

// Ortak prefix bulan yardımcı fonksiyon
function findCommonPrefix(strings) {
    if (!strings.length) return '';
    if (strings.length === 1) return strings[0];
    
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
        while (strings[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (!prefix) return '';
        }
    }
    return prefix;
}
