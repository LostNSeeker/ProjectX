#!/usr/bin/env python3
"""
Simple script to create extension icons
"""
import os

def create_simple_icon(size, filename):
    """Create a simple SVG icon and convert to PNG"""
    svg_content = f'''<svg width="{size}" height="{size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="{size}" height="{size}" fill="#4F46E5"/>
  <rect x="{size//4}" y="{size//3}" width="{size//2}" height="{size//3}" fill="white"/>
  <rect x="{size//2-2}" y="{size//4}" width="4" height="{size//6}" fill="white"/>
</svg>'''
    
    # For now, just create a simple text file as placeholder
    with open(filename, 'w') as f:
        f.write(f"# Icon placeholder for {size}x{size}\n")
        f.write(svg_content)

def main():
    os.makedirs('icons', exist_ok=True)
    
    sizes = [16, 32, 48, 128]
    for size in sizes:
        filename = f'icons/icon{size}.png'
        create_simple_icon(size, filename)
        print(f'Created {filename}')

if __name__ == "__main__":
    main()
