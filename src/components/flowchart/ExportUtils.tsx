import { Node, Edge } from 'reactflow'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const exportAsPNG = async (reactFlowInstance: any, filename: string = 'fluxograma') => {
  if (!reactFlowInstance) return

  try {
    // Obter o elemento do ReactFlow
    const element = document.querySelector('.react-flow')
    if (!element) return

    // Capturar como canvas
    const canvas = await html2canvas(element as HTMLElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
    })

    // Converter para PNG e baixar
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('Erro ao exportar PNG:', error)
  }
}

export const exportAsPDF = async (reactFlowInstance: any, filename: string = 'fluxograma') => {
  if (!reactFlowInstance) return

  try {
    // Obter o elemento do ReactFlow
    const element = document.querySelector('.react-flow')
    if (!element) return

    // Capturar como canvas
    const canvas = await html2canvas(element as HTMLElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
    })

    // Criar PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 297 // A4 width in mm
    const pageHeight = 210 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${filename}.pdf`)
  } catch (error) {
    console.error('Erro ao exportar PDF:', error)
  }
}

export const exportAsSVG = (nodes: Node[], edges: Edge[], filename: string = 'fluxograma') => {
  try {
    // Calcular dimensões
    const minX = Math.min(...nodes.map(n => n.position.x))
    const minY = Math.min(...nodes.map(n => n.position.y))
    const maxX = Math.max(...nodes.map(n => n.position.x + 150))
    const maxY = Math.max(...nodes.map(n => n.position.y + 100))

    const width = maxX - minX + 100
    const height = maxY - minY + 100

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`
    svg += `<rect width="100%" height="100%" fill="white"/>`

    // Adicionar nós
    nodes.forEach(node => {
      const x = node.position.x - minX + 50
      const y = node.position.y - minY + 50
      
      let shape = ''
      switch (node.type) {
        case 'process':
          shape = `<rect x="${x}" y="${y}" width="120" height="60" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="8"/>`
          break
        case 'decision':
          shape = `<polygon points="${x+60},${y} ${x+120},${y+30} ${x+60},${y+60} ${x},${y+30}" fill="#fecaca" stroke="#ef4444" stroke-width="2"/>`
          break
        case 'startEnd':
          shape = `<ellipse cx="${x+60}" cy="${y+30}" rx="60" ry="30" fill="#dcfce7" stroke="#10b981" stroke-width="2"/>`
          break
        default:
          shape = `<rect x="${x}" y="${y}" width="120" height="60" fill="#f3f4f6" stroke="#6b7280" stroke-width="2" rx="8"/>`
      }
      
      svg += shape
      svg += `<text x="${x+60}" y="${y+35}" text-anchor="middle" font-family="Arial" font-size="12" fill="#374151">${node.data.label}</text>`
    })

    // Adicionar arestas
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source)
      const targetNode = nodes.find(n => n.id === edge.target)
      
      if (sourceNode && targetNode) {
        const x1 = sourceNode.position.x - minX + 60 + 50
        const y1 = sourceNode.position.y - minY + 30 + 50
        const x2 = targetNode.position.x - minX + 60 + 50
        const y2 = targetNode.position.y - minY + 30 + 50
        
        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6b7280" stroke-width="2" marker-end="url(#arrowhead)"/>`
        
        if (edge.label) {
          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2
          svg += `<text x="${midX}" y="${midY-5}" text-anchor="middle" font-family="Arial" font-size="10" fill="#6b7280">${edge.label}</text>`
        }
      }
    })

    // Adicionar marcador de seta
    svg += `<defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#6b7280"/></marker></defs>`
    
    svg += '</svg>'

    // Baixar SVG
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.svg`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erro ao exportar SVG:', error)
  }
}

export const exportAsJSON = (nodes: Node[], edges: Edge[], filename: string = 'fluxograma') => {
  try {
    const data = {
      nodes,
      edges,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        tool: 'AtendeSoft Flowchart Editor'
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.json`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erro ao exportar JSON:', error)
  }
}
