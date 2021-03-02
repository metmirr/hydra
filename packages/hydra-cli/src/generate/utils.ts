import _, { upperFirst, kebabCase, camelCase, snakeCase } from 'lodash'
import { GeneratorContext } from './SourcesGenerator'
import { ObjectType, Field } from '../model'
import pluralize from 'pluralize'

export { upperFirst, kebabCase, camelCase }
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export function supplant(str: string, obj: Record<string, unknown>): string {
  return str.replace(/\${([^${}]*)}/g, (a, b) => {
    const r = obj[b]
    return typeof r === 'string' ? r : a
  })
}

export function pascalCase(str: string): string {
  return upperFirst(camelCase(str))
}

export function camelPlural(str: string): string {
  return camelCase(pluralize(str))
}

export function names(name: string): { [key: string]: string } {
  return {
    className: pascalCase(name),
    camelName: camelCase(name),
    kebabName: kebabCase(name),
    relClassName: pascalCase(name),
    relCamelName: camelCase(name),
    // Not proper pluralization, but good enough and easy to fix in generated code
    camelNamePlural: camelPlural(name),
  }
}

export function withNames(name: string): GeneratorContext {
  return {
    name,
    ...names(name),
  }
}

export function hasInterfaces(o: ObjectType): boolean {
  if (o.interfaces === undefined) {
    return false
  }
  return o.interfaces.length > 0
}

/**
 * Return fields which are not definded in the interface
 * @param o ObjecType definition
 */
export function ownFields(o: ObjectType): Field[] {
  if (!hasInterfaces(o) || o.interfaces === undefined) {
    return o.fields
  }

  const intrFields = o.interfaces[0].fields || []
  const fields = _.differenceBy(o.fields, intrFields, 'name')
  // Add non-scalar fields back to the object
  _.intersectionBy(o.fields, intrFields, 'name').forEach((f) => {
    if (!f.isBuildinType && f.relation) fields.push(f)
  })
  return fields
}

export function generateJoinColumnName(name: string): string {
  return snakeCase(name.concat('_id'))
}

export function generateJoinTableName(table1: string, table2: string): string {
  return snakeCase(table1.concat('_', table2))
}

export function generateEntityImport(entityName: string): string {
  const kebabName = kebabCase(entityName)
  return `import {${entityName}} from '../${kebabName}/${kebabName}.model'`
}

export function generateResolverReturnType(
  type: string,
  isList: boolean
): string {
  return `Promise<${type}${isList ? '[]' : ''} | null>`
}
