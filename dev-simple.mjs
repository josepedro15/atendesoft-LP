#!/usr/bin/env node

// Script de desenvolvimento simples
// Uso: node dev-simple.js

import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🚀 Ambiente de Desenvolvimento - Editor de Fluxogramas');
console.log('📁 Monitorando mudanças...');
console.log('');

// Função para executar comandos
async function runCommand(command, description) {
    try {
        console.log(`⚡ ${description}...`);
        const { stdout, stderr } = await execAsync(command);
        console.log(`✅ ${description} concluído`);
        return stdout;
    } catch (error) {
        console.error(`❌ Erro: ${error.message}`);
        throw error;
    }
}

// Função para fazer commit automático
async function autoCommit() {
    try {
        console.log('📝 Fazendo commit automático...');
        await runCommand('git add .', 'Adicionando arquivos');
        await runCommand('git commit -m "dev: Auto-commit ' + new Date().toLocaleTimeString() + ' - Testando edições"', 'Fazendo commit');
        console.log('✅ Commit realizado!');
        console.log('');
    } catch (error) {
        console.error('❌ Erro no commit:', error.message);
    }
}

// Função para fazer push para dev
async function pushToDev() {
    try {
        console.log('🚀 Fazendo push para branch de desenvolvimento...');
        await runCommand('git push origin dev-editor-fixes', 'Push para dev');
        console.log('✅ Push realizado!');
        console.log('');
    } catch (error) {
        console.error('❌ Erro no push:', error.message);
    }
}

// Função para monitorar arquivos
function watchFiles() {
    const watchPaths = [
        'src/components/flowchart/',
        'pages/fluxogramas/',
        'pages/api/flowcharts/'
    ];

    let timeout;
    
    watchPaths.forEach(watchPath => {
        if (fs.existsSync(watchPath)) {
            fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
                if (filename && (filename.endsWith('.tsx') || filename.endsWith('.ts') || filename.endsWith('.js'))) {
                    console.log(`📁 Arquivo modificado: ${watchPath}${filename}`);
                    
                    // Debounce - aguarda 2 segundos antes de fazer commit
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        autoCommit();
                    }, 2000);
                }
            });
            console.log(`👀 Monitorando: ${watchPath}`);
        }
    });
}

// Menu interativo
function showMenu() {
    console.log('\n🎯 Menu de Desenvolvimento:');
    console.log('1. 📝 Fazer commit manual');
    console.log('2. 🚀 Fazer push para dev');
    console.log('3. 📊 Ver status do git');
    console.log('4. 🔄 Fazer commit + push');
    console.log('5. 🧪 Testar página de teste');
    console.log('6. ❌ Sair');
    console.log('');
}

// Função para processar entrada do usuário
function processInput(input) {
    const choice = input.trim();
    
    switch (choice) {
        case '1':
            autoCommit();
            break;
        case '2':
            pushToDev();
            break;
        case '3':
            runCommand('git status', 'Verificando status');
            break;
        case '4':
            autoCommit().then(() => pushToDev());
            break;
        case '5':
            console.log('🧪 Acesse: http://localhost:3000/test-edit');
            break;
        case '6':
            console.log('👋 Saindo do ambiente de desenvolvimento...');
            process.exit(0);
            break;
        default:
            console.log('❌ Opção inválida');
    }
}

// Iniciar monitoramento
watchFiles();
showMenu();

// Configurar entrada do usuário
process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
    processInput(data);
    showMenu();
});

console.log('💡 Digite o número da opção desejada:');
